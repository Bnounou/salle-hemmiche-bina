
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/athletes", async (req, res) => {
  const sport = req.query.sport;
  const athletes = await prisma.athlete.findMany({
    where: { sport },
    include: {
  paiements: {
    orderBy: {
      mois: "asc"
    }
  }
}

  });
  res.json(athletes);
});

app.post("/api/athletes", async (req, res) => {
  const { nom, sport } = req.body;
  const athlete = await prisma.athlete.create({
    data: {
      nom,
      sport,
      paiements: {
        create: Array.from({ length: 12 }, (_, i) => ({
          mois: i + 1,
          paye: false
        }))
      }
    }
  });
  res.json(athlete);
});

app.put("/api/payer", async (req, res) => {
  const { paiementId, paye } = req.body;
  await prisma.paiement.update({
    where: { id: paiementId },
    data: { paye }
  });
  res.json({ success: true });
});

app.delete("/api/athletes/:id", async (req, res) => {
  await prisma.athlete.delete({
    where: { id: Number(req.params.id) }
  });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Salle Hemmiche Bina en ligne 🚀");
});
