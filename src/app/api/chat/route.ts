import { NextResponse } from "next/server"

const responses: Record<string, string> = {
  properties:
    "We have an exquisite collection of luxury properties including beachfront villas, penthouses, and commercial spaces. Prices range from $500,000 to $8.5 million. Would you like to see specific property types?",
  investment:
    "Nigeria's luxury real estate market shows strong growth potential, particularly in Lagos (Ikoyi, Victoria Island, Banana Island) and Abuja. Current ROI averages 8-15% annually for prime properties.",
  vehicles:
    "Our premium vehicle collection features Rolls-Royce, Lamborghini, Bentley, Porsche, and more. We have both new and pre-owned luxury vehicles. What type of vehicle interests you?",
  advertise:
    "Our AI Advertisement Boosting system uses smart targeting to reach high-net-worth buyers. Features include sponsored listings, AI-generated ad copy, audience targeting, and campaign analytics. Campaigns start from $500/month.",
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const input = message.toLowerCase()

    let response = ""
    if (input.includes("property") || input.includes("real estate") || input.includes("house") || input.includes("villa")) {
      response = responses.properties
    } else if (input.includes("invest") || input.includes("roi") || input.includes("market")) {
      response = responses.investment
    } else if (input.includes("vehicle") || input.includes("car") || input.includes("auto")) {
      response = responses.vehicles
    } else if (input.includes("advertise") || input.includes("boost") || input.includes("sponsor")) {
      response = responses.advertise
    } else {
      response =
        "I'd be happy to help you with our luxury marketplace. Could you please specify what you're looking for? You can ask about properties, vehicles, investment insights, or advertising options."
    }

    return NextResponse.json({ response })
  } catch {
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
