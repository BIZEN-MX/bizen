# 🌱 Seed Scripts

Quick reference for seeding your BIZEN database.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Edit your content
# Open seed/content.json and add your courses

# 3. Seed the database
npm run seed
```

## Files

- **content.json** - Your course content (edit this!)
- **content-template.json** - Example template
- **seed.ts** - Main seed script
- **clear-content.ts** - Database clear script

## Commands

```bash
# Seed content
npm run seed

# Seed from specific file
npm run seed my-content.json

# Clear all content
npm run seed:clear
```

## Content Structure

```json
{
  "courses": [
    {
      "title": "Course Name",
      "description": "Course description",
      "level": "Beginner",
      "isActive": true,
      "units": [
        {
          "title": "Module 1",
          "order": 1,
          "isLocked": false,
          "lessons": [
            {
              "title": "Lesson 1",
              "contentType": "video",
              "order": 1,
              "quizzes": [...]
            }
          ],
          "assignments": [...]
        }
      ]
    }
  ]
}
```

## Full Documentation

See **SEED_SCRIPT_GUIDE.md** in the root directory for complete documentation.

## Need Help?

1. Check SEED_SCRIPT_GUIDE.md
2. Look at content-template.json for examples
3. Validate your JSON syntax
4. Start with a simple course first

