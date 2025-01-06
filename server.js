const express = require("express");
const MBTiles = require('@mapbox/mbtiles');
const path = require("path");

const app = express();

// Serve static files (like test.html) from the current directory
app.use(express.static(path.join(__dirname)));

// Enable CORS and set correct mime type/content encoding
const header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type": "application/x-protobuf",
    "Content-Encoding": "gzip"
};

// Route to serve tiles from the .mbtiles file
app.get('/:source/:z/:x/:y.pbf', (req, res) => {
    const mbtilesPath = path.join(__dirname, 'tiles.mbtiles');  // Ensure your file is named 'tiles.mbtiles' or update the path if needed

    new MBTiles(mbtilesPath, (err, mbtiles) => {
        if (err) {
            res.status(500).json({ error: `Error opening MBTiles database: ${err.message}` });
            return;
        }

        // Fetch tile
        mbtiles.getTile(req.params.z, req.params.x, req.params.y, (err, tile) => {
            if (err) {
                res.status(404).json({ error: `Tile rendering error: ${err.message}` });
            } else {
                res.set(header);
                res.send(tile);
            }
        });
    });
});

// Start server on port 3002
const port = 3030;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
