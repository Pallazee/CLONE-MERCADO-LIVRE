import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

console.log("🚀 SERVER FILE EXECUTADO");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔐 TOKEN:", process.env.MP_ACCESS_TOKEN);

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

app.post("/create_preference", async (req, res) => {
  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "camiseta-branca-001",
            title: "Camiseta Branca",
            quantity: 1,
            unit_price: 1.99,
          },
        ],
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
      
      },
    });

    console.log("✅ PREFERENCE CRIADA:", response.id);

    res.json({ id: response.id });
  } catch (error: any) {
    console.error("❌ ERRO MERCADO PAGO:");
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar preferência",
      details: error?.message || error,
    });
  }
});

app.listen(3333, () => {
  console.log("🔥 Backend rodando em http://localhost:3333");
});
