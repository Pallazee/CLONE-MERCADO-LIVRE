import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const app = express();

/* =========================
   CONFIG BÁSICA
========================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

app.use(express.json());

/* =========================
   MERCADO PAGO CLIENT
========================= */
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN NÃO DEFINIDO");
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/* =========================
   ROTAS
========================= */
app.get("/", (_req, res) => {
  res.send("🔥 Backend Mercado Pago ONLINE");
});

/* =========================
   CREATE PREFERENCE
========================= */
app.post("/create_preference", async (_req, res) => {
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
            currency_id: "BRL",
          },
        ],

        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },

        back_urls: {
          success: "https://SEU-FRONT.onrender.com/success",
          failure: "https://SEU-FRONT.onrender.com/failure",
          pending: "https://SEU-FRONT.onrender.com/pending",
        },

        auto_return: "approved",
      },
    });

    console.log("✅ PREFERENCE CRIADA:", response.id);

    res.json({ id: response.id });
  } catch (error: any) {
    console.error("❌ ERRO AO CRIAR PREFERENCE:", error);

    res.status(500).json({
      error: "Erro ao criar preferência",
      details: error?.message || error,
    });
  }
});

/* =========================
   WEBHOOK (OBRIGATÓRIO)
========================= */
app.post("/webhook", async (req, res) => {
  try {
    console.log("🔔 WEBHOOK RECEBIDO");
    console.log(req.body);

    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });

      console.log("💰 STATUS:", result.status);
      console.log("💳 MÉTODO:", result.payment_method_id);

      // Aqui você pode:
      // - salvar no banco
      // - liberar produto
      // - enviar email
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ ERRO NO WEBHOOK:", error);
    res.sendStatus(500);
  }
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta ${PORT}`);
});
