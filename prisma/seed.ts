import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding StaticFlow database...");

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@staticflow.dev" },
    update: {},
    create: {
      email: "demo@staticflow.dev",
      name: "Demo User",
      role: "ADMIN",
      plan: "PRO",
    },
  });

  console.log(`  ✅ User: ${demoUser.name} (${demoUser.email})`);

  // Create sample projects
  const projects = [
    {
      name: "E-Commerce API",
      description: "Full e-commerce backend with auth, products, orders, and Stripe payments.",
      language: "node-express",
      framework: "express",
      database: "postgresql",
      status: "DEPLOYED" as const,
      endpointsCount: 34,
      securityScore: 95,
      code: {
        "src/index.ts": "// E-Commerce API Entry Point",
        "src/routes/products.ts": "// Product routes",
        "src/routes/orders.ts": "// Order routes",
      },
    },
    {
      name: "Blog Platform API",
      description: "Blog API with posts, comments, likes, and role-based access control.",
      language: "python-fastapi",
      framework: "fastapi",
      database: "postgresql",
      status: "DEPLOYED" as const,
      endpointsCount: 24,
      securityScore: 90,
      code: {
        "main.py": "# Blog API Entry Point",
        "routers/posts.py": "# Post routes",
      },
    },
    {
      name: "Healthcare Records API",
      description: "HIPAA-compliant patient records management with encryption.",
      language: "java-spring",
      framework: "spring-boot",
      database: "postgresql",
      status: "ACTIVE" as const,
      endpointsCount: 18,
      securityScore: 85,
      code: {},
    },
    {
      name: "Real-Time Chat API",
      description: "WebSocket-based chat with rooms, typing indicators, and read receipts.",
      language: "go-gin",
      framework: "gin",
      database: "mongodb",
      status: "DRAFT" as const,
      endpointsCount: 12,
      securityScore: 0,
      code: {},
    },
  ];

  for (const p of projects) {
    const project = await prisma.project.upsert({
      where: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-${p.name.toLowerCase().replace(/\s+/g, "-")}`,
        userId: demoUser.id,
        ...p,
      },
    });
    console.log(`  ✅ Project: ${project.name} (${project.status})`);
  }

  // Create sample security scan
  const ecommerceProject = await prisma.project.findFirst({
    where: { name: "E-Commerce API" },
  });

  if (ecommerceProject) {
    await prisma.securityScan.upsert({
      where: { id: "seed-scan-1" },
      update: {},
      create: {
        id: "seed-scan-1",
        projectId: ecommerceProject.id,
        scanType: "DEEP",
        status: "COMPLETED",
        score: 95,
        grade: "A+",
        vulnerabilities: [
          {
            severity: "low",
            title: "Missing X-Frame-Options header",
            description: "The API does not set X-Frame-Options header.",
            fix: "Add helmet middleware with frameguard enabled.",
            autoFixable: true,
          },
        ],
      },
    });
    console.log("  ✅ Security Scan: E-Commerce API (A+)");
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
