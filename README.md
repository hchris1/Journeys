# Journeys

## Quick Start

```bash
npm install
npm run dev
```

Or with Docker:

```bash
docker compose up --build
```

Open http://localhost:3000

## Adding a Journey

1. Create a folder in `content/journeys/`:
   ```bash
   mkdir content/journeys/my-trip
   ```

2. Add a `journey.json`:
   ```json
   {
     "title": "My Trip",
     "description": "A brief description.",
     "date": "2024-01-15",
     "location": "Location Name",
     "coverImage": "sunset.jpg"
   }
   ```
   `coverImage` is optional — defaults to the first image.

3. Drop your photos into the folder.

4. Restart the server. Images are automatically optimized into three sizes (thumb, medium, full) on startup.

## Site Config

Edit `content/site.json`:

```json
{
  "title": "Journeys",
  "description": "A collection of visual stories from around the world"
}
```
