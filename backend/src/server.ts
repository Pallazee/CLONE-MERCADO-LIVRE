import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { MercadoPagoConfig, Preference } from "mercadopago"

const app = express()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

app.use(express.json())

// 🔐 Mercado Pago config
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string
})

app.get("/", (_req, res) => {
  res.send("🔥 Backend Mercado Pago ONLINE")
})

app.post("/create_preference", async (_req, res) => {
  try {
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            id: "camiseta-branca-001",
            title: "Camiseta Branca",
            quantity: 1,
            unit_price: 1.99
          }
        ],
        payment_methods: {
          installments: 12
        },
        back_urls: {
          success: "https://SEU-FRONT.onrender.com/success",
          failure: "https://SEU-FRONT.onrender.com/failure",
          pending: "https://SEU-FRONT.onrender.com/pending"
        },
        auto_return: "approved"
      }
    })

    res.json({ id: response.id })
  } catch (error: any) {
    console.error("❌ Erro Mercado Pago:", error)

    res.status(500).json({
      error: "Erro ao criar preferência",
      details: error?.message
    })
  }
})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta ${PORT}`);
});
