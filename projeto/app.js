const express = require("express");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");
const Post = require("./models/post");

const app = express();

const hbs = expressHandlebars.create({
    defaultLayout: "main",
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("primeira_pagina");
});

app.get("/consulta", async (req, res) => {
    try {
        let posts = await Post.findAll();

        posts = posts.map(post => {
            let dataFormatada = '';
            if (post.data_contato) {
                const data = new Date(post.data_contato);
                dataFormatada = data.toLocaleDateString('pt-BR');
            }

            return { ...post, data_contato: dataFormatada };
        });

        res.render("consulta", { posts });
    } catch (erro) {
        res.send("Erro ao listar agendamentos: " + erro);
    }
});

app.post("/cadastrar", async (req, res) => {
    try {
        const dataTimestamp = new Date(req.body.data_contato).getTime(); 

        await Post.create({
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            data_contato: dataTimestamp,
            observacao: req.body.observacao
        });

        res.redirect("/confirmacao");
    } catch (erro) {
        res.send("Erro ao criar agendamento: " + erro);
    }
});

app.get("/confirmacao", (req, res) => {
    res.render("confirmacao");
});

app.get("/atualizar/:id", async (req, res) => {
    try {
        const post = await Post.findOne(req.params.id);

        if (!post) {
            return res.send("Agendamento não encontrado.");
        }

        if (post.data_contato) {
            const data = new Date(post.data_contato);
            post.data_contato = data.toISOString().split('T')[0];
        }

        res.render("atualizar", { post });
    } catch (erro) {
        res.send("Erro ao buscar agendamento: " + erro);
    }
});

app.post("/atualizar/:id?", async (req, res) => {
    try {
        const id = req.params.id || req.body.id;

        if (!id) {
            return res.send("Erro: ID do agendamento não fornecido.");
        }

        const dataTimestamp = new Date(req.body.data_contato).getTime(); 

        await Post.update(id, {
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            data_contato: dataTimestamp,
            observacao: req.body.observacao
        });

        res.redirect("/consulta");
    } catch (erro) {
        res.send("Erro ao atualizar agendamento: " + erro);
    }
});

app.get("/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findOne(id);

        if (!post) {
            return res.send("Agendamento não encontrado.");
        }

        await Post.delete(id);
        res.redirect("/consulta");
    } catch (erro) {
        res.send("Erro ao excluir agendamento: " + erro);
    }
});

app.listen(8081, () => {
    console.log("Servidor ativo na porta 8081!");
});
