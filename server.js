const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

function lerNotas() {
    const dados = fs.readFileSync("notas.json");
    return JSON.parse(dados);
}

function salvarNotas(notas) {
    fs.writeFileSync("notas.json", JSON.stringify(notas, null, 2));
}

app.get("/notas", (req, res) => {
    const notas = lerNotas();
    res.json(notas);
});

app.post("/notas", (req, res) => {

    const notas = lerNotas();

    const novaNota = {
        id: Date.now(),
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    };

    notas.push(novaNota);

    salvarNotas(notas);

    res.status(201).json(novaNota);
});

app.put("/notas/:id", (req, res) => {

    const id = Number(req.params.id);

    let notas = lerNotas();

    notas = notas.map(nota => {

        if (nota.id === id) {

            return {
                ...nota,
                titulo: req.body.titulo,
                conteudo: req.body.conteudo
            };
        }

        return nota;
    });

    salvarNotas(notas);

    res.json({
        mensagem: "Nota atualizada"
    });
});

app.delete("/notas/:id", (req, res) => {

    const id = Number(req.params.id);

    let notas = lerNotas();

    notas = notas.filter(nota => nota.id !== id);

    salvarNotas(notas);

    res.json({
        mensagem: "Nota removida"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});