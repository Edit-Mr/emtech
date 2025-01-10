import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

// Set the directory to serve files from (e.g., 'dist')
const baseDirectory = new URL("../dist", import.meta.url).pathname;

const server = http.createServer((req, res) => {
    try {
        // Decode the URL to handle special characters like Chinese
        let decodedUrl = decodeURIComponent(req.url);

        // If the URL ends with "/" or doesn't include a ".", append "index.html"
        let filePath = path.join(baseDirectory, decodedUrl);
        if (filePath.endsWith("/") || !filePath.includes(".")) {
            filePath = path.join(filePath, "index.html");
        }
        // if url is /category or /tag, render home page index.html
        if (
            decodedUrl.startsWith("/category") ||
            decodedUrl.startsWith("/tag") ||
            decodedUrl.startsWith("/search")
        ) {
            filePath = path.join(baseDirectory, "index.html");
        }
        // Ensure the file is inside the base directory (prevents path traversal attacks)
        if (!filePath.startsWith(baseDirectory)) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("400 Bad Request");
            return;
        }
        console.log(decodedUrl);
        // Read and serve the requested file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    data = fs.readFileSync(
                        path.join(baseDirectory, "404.html")
                    );
                    res.writeHead(404, {
                        "Content-Type": getContentType("404.html")
                    });
                    res.end(data);
                } else {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("500 Internal Server Error");
                }
            } else {
                res.writeHead(200, {
                    "Content-Type": getContentType(filePath)
                });
                res.end(data);
            }
        });
    } catch (e) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("400 Bad Request");
    }
});

const getContentType = (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".xml": "application/xml",
        ".xsl": "application/xml"
    };
    return mimeTypes[extname] || "application/octet-stream";
};

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

var generating = false;

// Watch the 'dist' directory for changes and run 'generate.js' when a change is detected
fs.watch(
    new URL("../", import.meta.url),
    { recursive: true },
    (eventType, filename) => {
        if (
            !generating &&
            filename &&
            !filename.includes("dist") &&
            !filename.includes(".git")
        ) {
            generating = true;
            console.log(`File changed: ${filename}. Running generate.js...`);
            exec("yarn build", (error, stdout, stderr) => {
                if (error) {
                    console.error(
                        `Error running generate.js: ${error.message}`
                    );
                    return;
                }
                if (stderr) {
                    console.error(`Error output: ${stderr}`);
                }
                console.log(`generate.js output: ${stdout}`);
                generating = false;
            });
        }
    }
);
