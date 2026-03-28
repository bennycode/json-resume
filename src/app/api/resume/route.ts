import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const resume = await prisma.resume.findFirst({
    include: {
      basics: {
        include: {
          location: true,
          profiles: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resume);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { basics } = body;

  // Upsert: find existing resume or create new one
  const existing = await prisma.resume.findFirst({
    include: { basics: { include: { profiles: true } } },
  });

  if (existing) {
    // Delete old profiles to replace them
    if (existing.basics) {
      await prisma.profile.deleteMany({
        where: { basicsId: existing.basics.id },
      });
    }

    const updated = await prisma.resume.update({
      where: { id: existing.id },
      data: {
        basics: {
          upsert: {
            create: {
              name: basics.name,
              label: basics.label,
              image: basics.image,
              email: basics.email,
              phone: basics.phone,
              url: basics.url,
              summary: basics.summary,
              location: {
                create: {
                  address: basics.location.address,
                  postalCode: basics.location.postalCode,
                  city: basics.location.city,
                  countryCode: basics.location.countryCode,
                  region: basics.location.region,
                },
              },
              profiles: {
                create: basics.profiles.map(
                  (p: { network: string; username: string; url: string }) => ({
                    network: p.network,
                    username: p.username,
                    url: p.url,
                  })
                ),
              },
            },
            update: {
              name: basics.name,
              label: basics.label,
              image: basics.image,
              email: basics.email,
              phone: basics.phone,
              url: basics.url,
              summary: basics.summary,
              location: {
                upsert: {
                  create: {
                    address: basics.location.address,
                    postalCode: basics.location.postalCode,
                    city: basics.location.city,
                    countryCode: basics.location.countryCode,
                    region: basics.location.region,
                  },
                  update: {
                    address: basics.location.address,
                    postalCode: basics.location.postalCode,
                    city: basics.location.city,
                    countryCode: basics.location.countryCode,
                    region: basics.location.region,
                  },
                },
              },
              profiles: {
                create: basics.profiles.map(
                  (p: { network: string; username: string; url: string }) => ({
                    network: p.network,
                    username: p.username,
                    url: p.url,
                  })
                ),
              },
            },
          },
        },
      },
      include: {
        basics: {
          include: {
            location: true,
            profiles: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  }

  const created = await prisma.resume.create({
    data: {
      basics: {
        create: {
          name: basics.name,
          label: basics.label,
          image: basics.image,
          email: basics.email,
          phone: basics.phone,
          url: basics.url,
          summary: basics.summary,
          location: {
            create: {
              address: basics.location.address,
              postalCode: basics.location.postalCode,
              city: basics.location.city,
              countryCode: basics.location.countryCode,
              region: basics.location.region,
            },
          },
          profiles: {
            create: basics.profiles.map(
              (p: { network: string; username: string; url: string }) => ({
                network: p.network,
                username: p.username,
                url: p.url,
              })
            ),
          },
        },
      },
    },
    include: {
      basics: {
        include: {
          location: true,
          profiles: true,
        },
      },
    },
  });

  return NextResponse.json(created, { status: 201 });
}
