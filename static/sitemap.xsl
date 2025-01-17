<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <!-- Template for the root element -->
    <xsl:template match="/">
        <html>
            <head>
                <title>毛哥EM資訊密技 Sitemap</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background-color: #f2f4f8;
                    color: #363636;
                    text-align:center;
                    }
                    table {
                    margin:auto;
                    border-collapse: collapse;
                    }
                    tr{
                    border-radius: 1.875rem;
                    border: 1px solid #ccc;
                    margin-bottom: 1rem;
                    display: block;
                    }
                    th, td {
                    padding: 10px;
                    }
                    tr:first-child {
                    background-color: #e7e7ff;
                    }
                    tr:nth-child(even) {
                    background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>毛哥EM資訊密技 Sitemap</h2>
                <p>歡迎各個爬蟲！如果你想要訂閱 RSS 的話請移至 <a href="/rss.xml">/rss.xml</a> 喔</p>
                <table>
                    <tr>
                        <th>Element Name</th>
                        <th>Content</th>
                    </tr>
                    <!-- Loop through each element and display it -->
                    <xsl:for-each select="*/*">
                        <tr>
                            <td>
                                <xsl:value-of select="name()" />
                            </td>
                            <td>
                                <xsl:value-of select="." />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>