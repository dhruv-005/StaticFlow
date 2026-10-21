import { NextResponse } from "next/server";

/* Template catalog — reference data for the marketplace UI.
   These are prompt templates users can click to auto-fill the builder. */

const templates = [
  {
    id: "tpl-ecommerce",
    title: "E-Commerce API",
    description: "Products, cart, orders, payments, and user auth.",
    category: "E-Commerce",
    promptTemplate: "Build an e-commerce API with 50 products, shopping cart, orders, and Stripe payments.",
  },
  {
    id: "tpl-blog",
    title: "Blog Platform API",
    description: "Posts, comments, likes, tags, and role-based access.",
    category: "Content",
    promptTemplate: "Build a blog API with 30 posts, comments, likes, tags, and admin/author/reader roles.",
  },
  {
    id: "tpl-saas",
    title: "SaaS Boilerplate API",
    description: "Multi-tenant SaaS with subscriptions, teams, and billing.",
    category: "SaaS",
    promptTemplate: "Build a multi-tenant SaaS API with 20 users, team management, subscriptions, and usage metering.",
  },
  {
    id: "tpl-chat",
    title: "Real-Time Chat API",
    description: "Chat rooms, direct messages, typing indicators.",
    category: "Social",
    promptTemplate: "Build a real-time chat API with 15 rooms, direct messages, typing indicators, and message history.",
  },
  {
    id: "tpl-healthcare",
    title: "Healthcare Records API",
    description: "Patient records, appointments, and encrypted storage.",
    category: "Healthcare",
    promptTemplate: "Build a healthcare API with 25 patient records, appointment scheduling, and encrypted data storage.",
  },
];

export async function GET() {
  return NextResponse.json({ templates });
}
