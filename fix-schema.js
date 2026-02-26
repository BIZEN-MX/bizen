const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(
  /generator client\s*\{\s*provider = "prisma-client-js"\s*\}/,
  `generator client {\n  provider = "prisma-client-js"\n  previewFeatures = ["multiSchema"]\n}`
);
schema = schema.replace(
  /datasource db\s*\{\s*provider = "postgresql"\s*url\s*=\s*env\("DATABASE_URL"\)\s*\}/,
  `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n  schemas  = ["public", "auth"]\n}`
);

schema = schema.replace(/^(model|enum)\s+\w+\s+\{[\s\S]+?^\}/gm, (match) => {
  if (!match.includes('@@schema')) {
    return match.replace(/^\}$/m, '  @@schema("public")\n}');
  }
  return match;
});

if (!schema.includes('model ImpactTarget')) {
  schema += `

// ==========================================
// IMPACTO SOCIAL
// ==========================================

model Foundation {
  id          String   @id @default(cuid())
  name        String
  logo        String?
  description String?
  website     String?
  createdAt   DateTime @default(now()) @map("created_at")

  impacts     SchoolImpact[]

  @@map("foundations")
  @@schema("public")
}

model SchoolImpact {
  id              String   @id @default(cuid())
  schoolId        String   @map("school_id")
  foundationId    String   @map("foundation_id")
  season          String   // e.g., "Primavera 2024"
  donatedAmount   Float    @map("donated_amount")
  beneficiaryCount Int     @map("beneficiary_count")
  reportUrl       String?  @map("report_url")
  createdAt       DateTime @default(now()) @map("created_at")

  school          School     @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  foundation      Foundation @relation(fields: [foundationId], references: [id], onDelete: Cascade)
  evidence        DonationEvidence[]

  @@map("school_impacts")
  @@schema("public")
}

model ImpactTarget {
  id              String   @id @default(cuid())
  title           String
  description     String?
  currentValue    Float    @map("current_value")
  targetValue     Float    @map("target_value")
  unit            String   // e.g., "despensas", "becas"
  deadline        DateTime?
  schoolId        String?  @map("school_id") // If null, it's a global target
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("impact_targets")
  @@schema("public")
}

model DonationEvidence {
  id              String   @id @default(cuid())
  schoolImpactId  String   @map("school_impact_id")
  title           String
  description     String?
  imageUrl        String   @map("image_url")
  date            DateTime
  createdAt       DateTime @default(now()) @map("created_at")

  schoolImpact    SchoolImpact @relation(fields: [schoolImpactId], references: [id], onDelete: Cascade)

  @@map("donation_evidence")
  @@schema("public")
}
`;
}

if (!schema.includes('schoolImpacts SchoolImpact[]')) {
  schema = schema.replace(
    /(\s* schoolCourses\s+SchoolCourse\[\]\s*)/,
    '$1\n  schoolImpacts SchoolImpact[]\n'
  );
}

fs.writeFileSync('prisma/schema.prisma', schema);
