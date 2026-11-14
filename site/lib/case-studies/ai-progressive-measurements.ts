import type { CaseStudy } from "./types";

/**
 * AI progressive measurements (Lenskart).
 *
 * To put a picture in a slot, add `src` to that shot, for example
 * `src: "/work/ai-progressive-measurements/capture.png"` with the file in `public/work/ai-progressive-measurements/`.
 * `source` says where each picture is today; it is only shown on the placeholder.
 * Blocks of type "todo" are things only you can add.
 */
export const measurements: CaseStudy = {
  slug: "ai-progressive-measurements",
  workId: "ai",
  name: "AI progressive measurements",
  company: "Lenskart",
  meta: {
    title: "Progressive lens measurements any store staff can take",
    description:
      "An iPad flow that turned a 15–20 minute specialist measurement into a 3–5 minute task for any Lenskart store staff member. Live in every store in India.",
  },
  title: "Progressive lens measurements any store staff can take",
  outcome: "15–20 minutes down to 3–5, live in every Lenskart store",
  lede: "An iPad flow, with AI and a frame-mounted device, that turns a trained specialist’s task into one any staff member can run with minimal training.",
  stats: [
    { value: "70% faster", label: "3–5 minutes per measurement, down from 15–20" },
    { value: "Any staff", label: "can take the measurement after minimal training" },
    { value: "Every store", label: "live across Lenskart in India" },
  ],
  facts: [
    { label: "Role", value: "Led design of the iPad experience, end to end" },
    { label: "Team", value: "Product manager, iOS lead, with the data science team" },
    { label: "Platform", value: "iPad, across two devices in store" },
    { label: "Status", value: "Live in every Lenskart store in India" },
  ],
  hero: {
    kind: "video",
    label: "Placing a marker on the pupil with the zoomed-in view",
    source: "On your Framer page as the first “Align markers” video",
    caption: "Aligning a pupil marker with the zoomed-in view.",
    ratio: "16/9",
  },
  cut30: [
    { label: "The problem", body: "Progressive lenses need measurements for one frame on one face. Only a few trained staff per store could take them, at 15–20 minutes each." },
    { label: "The key decisions", body: "A scan gates the camera, guides judge alignment, a zoomed view places the markers, and AI and manual values sit side by side." },
    { label: "The pilot", body: "85% AI–manual parity against a 98% target, so manual stayed the source of truth." },
    { label: "The result", body: "3–5 minutes per measurement, minimal training, and live in every Lenskart store in India." },
  ],
  chapters: [
    {
      id: "backstory",
      label: "Backstory",
      title: "Only a handful of staff per store could take this measurement",
      blocks: [
        {
          type: "text",
          body: [
            "A progressive lens has three zones, for near, intermediate and far vision. They only work when they line up with how a person actually wears a frame. Get the measurements wrong and customers face eye strain, slow adaptation and remakes.",
            "Taking them needed rulers, manual lens cards, 15–20 minutes and a trained specialist, and each store had only a handful. On weekends, five or six customers would queue for measurements alone.",
          ],
        },
        {
          type: "versus",
          sides: [
            {
              tag: "Before",
              title: "Rulers and lens cards",
              body: "15–20 minutes, by the few staff trained to do it.",
              shot: {
                label: "The manual measurement: a ruler and lens card on a customer",
                source: "New. A photo from a store works best",
                ratio: "4/3",
              },
            },
            {
              tag: "After",
              title: "An iPad at a measurement station",
              body: "3–5 minutes, by any member of staff.",
              shot: {
                label: "The iPad capture screen in use, or a photo of the station",
                source: "New, or “Photo capture” from your Framer page",
                ratio: "4/3",
              },
            },
          ],
        },
      ],
    },
    {
      id: "premise",
      label: "The premise",
      title: "A measurement is only true for one frame on one face",
      blocks: [
        {
          type: "text",
          body: [
            "The zones are positioned by how a specific frame sits: its height on the nose bridge, its tilt, its distance from the eye. Change the frame and every number changes with it. Measure before the frame is chosen and you have measured nothing.",
            "So the flow cannot begin until a frame is selected, and the camera does not open until a scan confirms that the frame in hand is the frame in the cart.",
          ],
        },
        {
          type: "shot",
          shot: {
            label: "A diagram of the three vision zones on a lens, and what moves them: frame height, tilt, distance from the eye",
            source: "New, or adapt the lens visual on your Framer page",
            caption: "The three zones sit where this frame sits on this face.",
            ratio: "16/9",
          },
        },
        { type: "todo", text: "How you learned the domain: a store visit, a session with a specialist, or a line one of them said." },
      ],
    },
    {
      id: "setup",
      label: "The setup",
      title: "Two devices, because that is how a store works",
      blocks: [
        {
          type: "text",
          body: ["This is not one iPad experience. A salesperson helps the customer choose on the floor, and any member of staff takes the measurement at a station."],
        },
        {
          type: "flow",
          rows: [
            {
              label: "Salesperson’s iPad",
              layer: "co",
              steps: [
                { text: "Cart flags the frame", note: "Measurements: Pending", col: 1 },
                { text: "Checkout unlocks", col: 8 },
              ],
            },
            {
              label: "Measurement station",
              layer: "work",
              steps: [
                { text: "Pick customer and operator", col: 2 },
                { text: "Scan the frame", focus: true },
                { text: "Capture front and side", focus: true },
                { text: "Align the markers", focus: true },
                { text: "AI and manual values", focus: true },
                { text: "Frame measurements" },
              ],
            },
          ],
          caption: "The highlighted steps are the four decisions in the next chapter.",
        },
        {
          type: "scenes",
          items: [
            {
              title: "The status lives on the cart",
              body: [
                "A frame with a progressive lens shows Measurements: Pending on the cart, where salespeople already work, not in a separate app they would have to remember to check. Checkout stays disabled until the measurements are captured.",
              ],
              shots: [
                {
                  label: "The cart with pending and completed frame cards, and the modal that blocks checkout",
                  source: "On your Framer page as “Card States” and “Error Modal”",
                  ratio: "4/3",
                },
              ],
            },
            {
              title: "The station opens on a queue",
              body: [
                "One station serves the whole floor, so the iPad opens on a queue of customers and the frames in their carts. Staff pick themselves as operator before starting, which ties every measurement to a person.",
              ],
              shots: [
                {
                  label: "The customer queue and operator selection",
                  source: "On your Framer page as “Customer and employee selection”",
                  ratio: "4/3",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "key-scenes",
      label: "Key scenes",
      title: "Four decisions carry the flow",
      blocks: [
        {
          type: "scenes",
          items: [
            {
              title: "The camera won’t open until the frame is scanned",
              body: [
                "Scanning the frame’s QR code checks the frame in hand against the frame in the cart, so the flow refuses to start on the wrong one. Tags get scratched or lost, so typing the product ID is the fallback.",
              ],
              shots: [
                {
                  label: "Select frame, then the QR scan with manual entry as the fallback",
                  source: "On your Framer page as “Select frame” and “Verify frame”",
                  ratio: "4/3",
                },
              ],
            },
            {
              title: "The guide turns red, so staff don’t have to judge alignment",
              body: [
                "Staff with minimal training can’t reliably judge alignment by eye, so the system judges for them. The face guide turns red the moment the customer drifts out of position.",
              ],
              shots: [
                {
                  label: "Photo capture in three states: not aligned, aligned, image captured",
                  source: "On your Framer page as “Photo capture”",
                  ratio: "16/9",
                },
              ],
            },
            {
              title: "A zoomed view for pupil-level precision",
              body: [
                "Markers go on the pupil centre and the bottom edge of the lens, so every marker comes with a zoomed-in view and each eye is its own step. The side profile reuses the same interaction.",
              ],
              shots: [
                {
                  kind: "video",
                  label: "Aligning the pupil markers, then the side-profile markers",
                  source: "On your Framer page as the two “Align markers” videos",
                  ratio: "16/9",
                },
              ],
            },
            {
              title: "AI and manual values side by side, and staff make the call",
              body: [
                "Staff enter manual values next to the AI’s on an illustration of the frame. During testing they choose which set goes on the order, and every entry becomes an AI-versus-manual data point.",
              ],
              shots: [
                {
                  label: "Manual values entered beside the AI’s, and the modal to choose between them",
                  source: "On your Framer page as “Progressive measurements”",
                  ratio: "16/9",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pilot",
      label: "The pilot",
      title: "The pilot reached 85% parity against a 98% target, and the flow was built for that",
      blocks: [
        {
          type: "text",
          body: [
            "The system ran for one month in two flagship stores, Indiranagar and HSR Layout. Every progressive customer was measured twice, by AI and by hand, inside the same flow, so validation was a by-product of serving real customers.",
          ],
        },
        {
          type: "stats",
          items: [
            { value: "85%", label: "AI–manual parity after one month" },
            { value: "98%", label: "the accuracy floor the model had to reach" },
          ],
        },
        {
          type: "text",
          body: [
            "Below the floor, which is exactly why the flow was built the way it was. Manual stayed the source of truth, and the data science team used the paired captures to refine the model before the national rollout.",
          ],
        },
        {
          type: "intertitle",
          label: "The principle",
          line: "The design assumed the AI would start imperfect, and made its improvement part of the workflow.",
        },
      ],
    },
    {
      id: "box-office",
      label: "Box office",
      title: "70% faster, and live in every Lenskart store",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "70% faster", label: "3–5 minutes per measurement, down from 15–20" },
            { value: "Every store", label: "live across Lenskart in India" },
            { value: "No skill gate", label: "capacity no longer limited to a store’s most trained staff" },
          ],
        },
        { type: "todo", text: "The store count, and the effect on weekend queues or remakes if you can share it." },
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
              title: "The domain wrote the brief",
              body: "One fact about lenses decided the order of every screen. Understanding the process came before designing any of it.",
            },
            {
              title: "Design for an AI that starts imperfect",
              body: "At 85% parity the model could not be trusted alone. The flow kept people in charge and turned every measurement into training data.",
            },
          ],
        },
        { type: "todo", text: "What you would do differently, in your own words." },
      ],
    },
  ],
  credits: [
    { role: "Design", name: "Suhas Paunikar" },
    { role: "Product", name: "Rahul Rupani" },
    { role: "iOS", name: "Shubham" },
    { role: "Model", name: "Data science team, Lenskart" },
  ],
};
