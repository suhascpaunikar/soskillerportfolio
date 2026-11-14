import type { CaseStudy } from "./types";

/**
 * Pickup in store (Lenskart).
 *
 * To put a picture in a slot, add `src` to that shot, for example
 * `src: "/work/pickup-in-store/cart.png"` with the file in `public/work/pickup-in-store/`.
 * `source` says where each picture is today; it is only shown on the placeholder.
 * Blocks of type "todo" are things only you can add.
 */
export const pickup: CaseStudy = {
  slug: "pickup-in-store",
  workId: "pickup",
  name: "Pickup in store",
  company: "Lenskart",
  meta: {
    title: "Reviving store pickup at Lenskart",
    description:
      "Lenskart had tried store pickup once and pulled it. A lighter choice at checkout now sends 23 in 100 online orders to stores, with 2.5× fewer returns.",
  },
  title: "Reviving store pickup at Lenskart",
  outcome: "23 in 100 online orders, 2.5× fewer returns",
  lede: "Buy online, collect in store. Lenskart had launched it once and pulled it. I redesigned how checkout offers the choice.",
  stats: [
    { value: "23 in 100", label: "online orders now picked up in store" },
    { value: "2.5×", label: "fewer returns on pickup orders than on delivery" },
    { value: "+20 NPS", label: "among customers who picked up" },
  ],
  facts: [
    { label: "Role", value: "Sole designer: research, flows, prototyping, testing" },
    { label: "Team", value: "2 product managers, Android lead, iOS lead" },
    { label: "Platform", value: "Lenskart app, iOS and Android" },
    { label: "Status", value: "Live at full rollout" },
  ],
  hero: {
    label: "The shipped cart in both states: Home delivery at ₹2,000 and Collect from store at ₹1,950",
    source: "On your Framer page as “Cart screen”",
    caption: "The whole choice is two lines above the pay button.",
    ratio: "4/3",
  },
  cut30: [
    { label: "The problem", body: "Pickup cuts returns, but the last attempt was pulled, and checkout is the most fragile step in the funnel." },
    { label: "What happened", body: "V1 gave the choice a screen of its own: 10–12% adoption, and a 10% drop in checkout conversion." },
    { label: "The key decision", body: "Lighter, not louder: two lines on the cart, with the ₹50 pickup saving showing in the total." },
    { label: "The result", body: "23–25% adoption, conversion recovered, 2.5× fewer returns and +20 NPS." },
  ],
  chapters: [
    {
      id: "backstory",
      label: "Backstory",
      title: "Pickup was a margin lever that had already been pulled once",
      blocks: [
        {
          type: "text",
          body: [
            "Eyewear rarely ends at delivery. Frames need adjusting, the fit needs checking, and sometimes the power is wrong. An order collected in store turns that into a visit: staff fix it on the spot, and a delivery cost becomes footfall.",
            "Lenskart had launched pickup about three years earlier and pulled it after operational issues and a drop in NPS. Yet customers who picked up returned less and were more satisfied. The value was never in doubt. The execution was.",
          ],
        },
        {
          type: "shot",
          shot: {
            label: "The earlier pickup flow, from the first attempt",
            source: "On your Framer page as “Previous designs”",
            caption: "The first attempt: a Mode of delivery screen in front of every customer.",
            ratio: "16/9",
          },
        },
      ],
    },
    {
      id: "problem",
      label: "The problem",
      title: "Checkout is the worst place to add a decision",
      blocks: [
        {
          type: "points",
          items: [
            {
              title: "Any added decision costs conversion",
              body: "Checkout is the most conversion-sensitive step in the funnel. Every extra screen, tap or pause is a chance to abandon.",
            },
            {
              title: "Nobody arrives looking for pickup",
              body: "Customers reach checkout expecting delivery. Pickup has to introduce itself and make its case in a glance.",
            },
          ],
        },
        {
          type: "lists",
          items: [
            { label: "Four benefits to land in a glance", items: ["Next-day delivery", "Perfect fit guaranteed", "Instant exchange", "Expert care"] },
            {
              label: "Two fixed constraints",
              items: ["No cash on delivery for pickup, said before payment", "Room for a promotional tag, in case pickup is ever discounted"],
            },
          ],
        },
        {
          type: "takeaway",
          label: "The question",
          line: "How much room does pickup need to make its case, without slowing anyone who just wants to pay?",
        },
      ],
    },
    {
      id: "rough-cut",
      label: "Rough cut",
      title: "Every competitor used a separate delivery step. So did my first version.",
      blocks: [
        {
          type: "notes",
          label: "What four retail apps taught me",
          items: [
            { term: "Decathlon, Shoppers Stop", body: "Show the store with its distance. I carried this into my store card." },
            { term: "Uniqlo", body: "Frame pickup as an incentive, not a compromise." },
            { term: "Lifestyle", body: "What to avoid: pickup buried below the fold." },
          ],
        },
        {
          type: "shot",
          shot: {
            label: "Checkout in Lifestyle, Shoppers Stop, Decathlon and Uniqlo, side by side",
            source: "On your Framer page as “Similar apps”",
            caption: "All four use the same structure: cart, then a dedicated delivery screen, then payment.",
            ratio: "16/9",
          },
        },
        { type: "subhead", text: "Four ways to ask the question" },
        {
          type: "options",
          items: [
            {
              name: "Option 1",
              pro: "Side by side, easy to compare.",
              con: "Both addresses and all four benefits at once became information overload.",
              verdict: { text: "Cut", tone: "cut" },
              shot: { label: "Option 1", source: "Crop from “Options 1 & 2” on your Framer page", ratio: "9/16" },
            },
            {
              name: "Option 2",
              pro: "One-tap cards, fast with several saved addresses.",
              con: "The screen filled with detail, and “View other stores” got lost.",
              verdict: { text: "Cut", tone: "cut" },
              shot: { label: "Option 2", source: "Crop from “Options 1 & 2” on your Framer page", ratio: "9/16" },
            },
            {
              name: "Option 3",
              pro: "A bottom sheet feels like a step, not a new screen.",
              con: "Once the chosen address had to show, a full screen made more sense.",
              verdict: { text: "Cut", tone: "cut" },
              shot: { label: "Option 3", source: "Crop from “Options 3 & 4” on your Framer page", ratio: "9/16" },
            },
            {
              name: "Option 4",
              pro: "Pickup pre-selected, and only the chosen card expands. The least overload that met every requirement.",
              verdict: { text: "Shipped as V1", tone: "shipped" },
              shot: { label: "Option 4", source: "Crop from “Options 3 & 4” on your Framer page", ratio: "9/16" },
            },
          ],
        },
      ],
    },
    {
      id: "test-screening",
      label: "Test screening",
      title: "The first version got pickup to 10–12% and cost 10% of checkout conversion",
      blocks: [
        {
          type: "text",
          body: ["The feature had failed once, so Option 4 was tested before it was rolled out."],
        },
        {
          type: "split",
          parts: [
            { label: "V1", share: 10, note: "The new screen", focus: true },
            { label: "Existing flow", share: 90, note: "The control" },
          ],
        },
        {
          type: "stats",
          items: [
            { value: "10–12%", label: "pickup adoption in the first week", tone: "up" },
            { value: "−10%", label: "checkout conversion against the control", tone: "down" },
          ],
        },
        { type: "text", body: ["The funnel said stop, but not why. So we called users before acting on it."] },
        { type: "subhead", text: "Part of the drop had walked into a store" },
        {
          type: "text",
          body: [
            "Some customers the funnel counted as lost had reached the delivery screen, changed their minds, and gone to a store to see the frame and buy it there. Part of the drop was a measurement artefact, not lost business.",
          ],
        },
        {
          type: "notes",
          label: "What customers who picked up told us",
          items: [
            { term: "Why pickup?", body: "Convenience: the store was near home." },
            { term: "When?", body: "Mostly after 5 pm on weekdays, on the way home." },
            { term: "How was the fit?", body: "Most were happy. Some got a custom fit from staff." },
            { term: "And the power?", body: "Right for most. A few were re-tested in store and had lenses replaced." },
          ],
        },
        { type: "todo", text: "Two or three lines customers said on the calls, word for word." },
        {
          type: "intertitle",
          label: "The decision",
          line: "Pickup wasn’t the problem. How we introduced it was.",
          sub: "Keep the feature. Make the choice lighter.",
        },
      ],
    },
    {
      id: "final-cut",
      label: "Final cut",
      title: "From a full screen to two lines on the cart",
      blocks: [
        {
          type: "text",
          body: [
            "V2 moved the choice out of its own screen and into a two-line widget on the cart. Customers recognise delivery from the first line of their address and pickup from the store’s area name. Proceed to payment now goes straight to payment.",
          ],
        },
        {
          type: "flow",
          rows: [
            {
              label: "V1 · 10% test",
              layer: "work",
              steps: [{ text: "Cart" }, { text: "Choose delivery or pickup", focus: true }, { text: "Payment" }],
            },
            {
              label: "V2 · Full rollout",
              layer: "work",
              steps: [{ text: "Cart, with the choice on it", focus: true }, { text: "Payment" }],
            },
          ],
          caption: "Three steps became two.",
        },
        {
          type: "versus",
          sides: [
            {
              tag: "V1 · 10% test",
              title: "A screen of its own",
              body: "Every customer stopped here, even those who only wanted delivery.",
              shot: {
                label: "V1: the Shipping address screen, with Pickup at store pre-selected",
                source: "Option 4 in “Options 3 & 4” on your Framer page",
                ratio: "4/5",
              },
            },
            {
              tag: "V2 · Full rollout",
              title: "Two lines on the cart",
              body: "Both options sit above the pay button.",
              shot: {
                label: "V2: the cart with the two-line choice",
                source: "On your Framer page as “Cart screen”",
                ratio: "4/5",
              },
            },
          ],
        },
        {
          type: "scenes",
          items: [
            {
              title: "The saving shows where the choice is made",
              body: ["Choosing Collect from store takes ₹50 off, and the pay button updates from ₹2,000 to ₹1,950."],
              shots: [
                {
                  label: "Close-up of the two-line choice and the pay button, in both states",
                  source: "Crop from “Cart screen” on your Framer page",
                  ratio: "16/9",
                },
              ],
            },
            {
              title: "Stores listed by distance, with the benefits up top",
              body: ["Editing the pickup line opens store selection: a benefits banner, search by area or PIN, and nearby stores with their distances."],
              shots: [
                {
                  label: "Select address and Select store, side by side",
                  source: "On your Framer page as “Address & store screen”",
                  ratio: "4/3",
                },
              ],
            },
            {
              title: "Order cards that say when to walk in",
              body: ["A card for each stage: arriving at the store, awaiting collection, picked up. Nobody has to call the store to check."],
              shots: [
                {
                  label: "The three order cards: arriving at store, awaiting pickup, picked up",
                  source: "On your Framer page as “Post Order Cards”",
                  ratio: "16/9",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "box-office",
      label: "Box office",
      title: "Adoption doubled and conversion recovered in full",
      blocks: [
        { type: "text", body: ["Shrinking pickup from a full screen to two lines on the cart didn’t bury it. It doubled it."] },
        {
          type: "stats",
          items: [
            { value: "23 in 100", label: "online orders picked up in store, up from 10–12 in V1" },
            { value: "Recovered", label: "checkout conversion, back to baseline" },
            { value: "2.5×", label: "fewer returns than on delivery orders" },
            { value: "+20 NPS", label: "among customers who picked up" },
          ],
        },
        { type: "text", body: ["Every pickup order also saves on shipping and on returns."] },
        { type: "todo", text: "The period these numbers cover, and the rupee saving on shipping and returns if you can share it." },
      ],
    },
    {
      id: "commentary",
      label: "Director’s commentary",
      title: "Two things this project taught me",
      blocks: [
        {
          type: "lessons",
          items: [
            {
              title: "A funnel can be wrong about who it lost",
              body: "The dashboard counted a 10% drop. Calls showed that some of those customers were standing in a store.",
            },
            {
              title: "Lighter beat louder",
              body: "A full screen got pickup to 10–12%. Two lines on the cart got it to 23–25%.",
            },
          ],
        },
        { type: "todo", text: "What you would do differently, in your own words." },
      ],
    },
  ],
  credits: [
    { role: "Design", name: "Suhas Paunikar" },
    { role: "Product", name: "Piyush Gupta" },
    { role: "Product", name: "Vikraman Sridharan" },
    { role: "Android", name: "Shivesh Mehta" },
    { role: "iOS", name: "Shubham" },
  ],
};
