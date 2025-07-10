# ⚽ ScoutMatch

**ScoutMatch** é uma aplicação backend desenvolvida com **Spring Boot** que realiza o match entre jogadores de futebol e times, baseado em critérios como posição, perna boa, estilo de jogo, skill e faixa etária.

---

## 🚀 Tecnologias

- Java 17  
- Spring Boot 3  
- Spring Data JPA  
- H2 Database (em memória)  
- Postman (para testes da API)  

---

## 📦 Como rodar o projeto localmente

1. **Clone o repositório**
```bash
git clone https://github.com/thiago1187/ScoutMatch.git
cd ScoutMatch

	2.	Abra o projeto na sua IDE (IntelliJ, VS Code, etc.)
	3.	Execute a aplicação

	•	Via terminal:

./mvnw spring-boot:run

	•	Ou rode a classe ScoutMatchApplication.java

	4.	A aplicação estará disponível em:
http://localhost:8080

⸻

📫 Endpoints da API

🔹 Criar Jogador

POST /jogadores

Exemplo de corpo da requisição:

{
  "nome": "Thiago Silva",
  "posicao": "Zagueiro",
  "pernaBoa": "Direita",
  "melhorSkill": "Cabeceio",
  "estiloDeJogo": "Defensivo",
  "idade": 39
}


⸻

🔹 Criar Time

POST /times

Exemplo de corpo da requisição:

{
  "nome": "FC Recife",
  "posicaoDesejada": "Zagueiro",
  "pernaDesejada": "Direita",
  "skillDesejada": "Cabeceio",
  "estiloProcurado": "Defensivo",
  "minIdade": 30,
  "maxIdade": 40
}


⸻

🔹 Ver Matches para um Time

GET /times/{id}/matches

Exemplo de retorno:

[
  {
    "nome": "Thiago Silva",
    "compatibilidade": 5,
    "resumo": "Muito compatível: posição, perna, skill, estilo, idade combinam com o time"
  },
  {
    "nome": "Outro Jogador",
    "compatibilidade": 3,
    "resumo": "Compatível: posição, estilo, idade combinam com o time"
  }
]


⸻

🧠 Lógica de Match

A lógica de compatibilidade avalia os seguintes critérios:
	•	Posição
	•	Perna boa
	•	Melhor skill
	•	Estilo de jogo
	•	Faixa etária (mínima e máxima)

Cada critério compatível soma 1 ponto.
Os jogadores são ordenados por pontuação, e o sistema retorna um resumo explicando o grau de compatibilidade.

⸻

👨‍💻 Autor

Desenvolvido por Thiago Macena
