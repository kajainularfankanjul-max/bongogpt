import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: `${prompt}, bangladeshi style, 4k, ultra detailed, realistic`,
          num_outputs: 1,
          aspect_ratio: "1:1",
          num_inference_steps: 4
        }
      }
    )
    return NextResponse.json({ image: output[0] })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
