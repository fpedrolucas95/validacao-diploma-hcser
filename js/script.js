function formatarData(dataStr) {
    if (!dataStr) return "";

    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/; // expressão regular para validar o formato da data
    if (!dataRegex.test(dataStr)) return ""; // verificar se a data está no formato correto

    const partes = dataStr.split("/");
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    return `${dia}/${mes}/${ano}`;
}

async function verificarCertificado() {
    const codigo = document.getElementById("codigo").value.trim();

    const spreadsheetID = 'ID DA PLANILHA';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:json`;

    // Buscar os valores da coluna I ao invés das colunas A a I
    const data = await fetch(url)
        .then(res => res.text())
        .then(text => JSON.parse(text.substr(47).slice(0, -2)));

    try {
        const response = await fetch(url);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const entries = data.table.rows;
        let row, nome, curso, duracao, conclusao;

        // Percorrer as linhas da planilha a partir da segunda linha em busca do código SHA-256
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].c[8].v === codigo) {
                row = i + 1;
                nome = entries[i].c[1].v;
                curso = entries[i].c[4].v;
                duracao = entries[i].c[5].v;
                conclusao = formatarData(entries[i].c[6].v); // formatar a data corretamente
                break;
            }
        }

        // Exibir o resultado da verificação na página
        const resultado = document.getElementById("resultado");
        if (row) {
            resultado.innerHTML = `<i class="fas fa-check-circle"></i> Prezado(a) <b>${nome}</b>,<br>
            É com grande satisfação que informamos que seu certificado do curso <b>${curso}</b> é autêntico e válido.<br>
            <br>
            Parabéns pelo seu desempenho e dedicação durante o curso.
            <br><br>
            Atenciosamente,<br>
            Hilda Carla Marques Vieira.
            `;
            resultado.classList.remove("text-red-500");
            resultado.classList.add("text-green-500");
        } else {
            resultado.innerHTML = `<i class="fas fa-times-circle"></i> Infelizmente nenhum certificado foi encontrado para o código digitado. Verifique se o código foi inserido corretamente e tente novamente`;
            resultado.classList.remove("text-green-500");
            resultado.classList.add("text-red-500");
        }
    } catch (error) {
        // Lidar com possíveis erros de requisição
        const resultado = document.getElementById("resultado");
        resultado.innerHTML =
            "Erro ao acessar a planilha. Verifique se o URL da planilha está correto e se a planilha está pública e acessível a todos.";
        resultado.classList.remove("text-green-500");
        resultado.classList.add("text-red-500");
        console.error(error);
    }
}
