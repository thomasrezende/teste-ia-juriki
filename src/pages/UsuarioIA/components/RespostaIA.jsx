import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./RespostaIA.module.css";

// Ícone do girassol (logo Juriki) para o avatar da IA
const AvatarIA = () => (
  <div className={styles.avatarIA}>
    <img src="/Logo-juriki-girassol-completo-2@2x.png" alt="Juriki" />
  </div>
);

// Aplica apenas classes CSS aos elementos HTML — sem forçar emojis ou detectar conteúdo.
// A IA decide livremente a estrutura e os emojis via markdown.
const componentesMarkdown = {
  p({ children }) {
    return <p className={styles.paragrafo}>{children}</p>;
  },
  li({ children }) {
    return <li className={styles.itemLista}>{children}</li>;
  },
  ul({ children }) {
    return <ul className={styles.lista}>{children}</ul>;
  },
  ol({ children }) {
    return <ol className={styles.lista}>{children}</ol>;
  },
  strong({ children }) {
    return <strong className={styles.negrito}>{children}</strong>;
  },
};

/**
 * RespostaIA
 *
 * Props:
 *  - conteudo  : string  — texto markdown retornado pelo n8n
 *  - horario   : string  — ex: "10:26"
 *  - carregando: boolean — exibe shimmer enquanto aguarda resposta
 */
const RespostaIA = ({ conteudo, horario, carregando = false }) => {
  const [textoExibido, setTextoExibido] = useState("");

  useEffect(() => {
    if (!conteudo || carregando) return;

    let index = 0;

    const intervalo = setInterval(() => {
      index++;
      setTextoExibido(conteudo.slice(0, index));
      if (index >= conteudo.length) {
        clearInterval(intervalo);
      }
    }, 15);

    return () => clearInterval(intervalo);
  }, [conteudo, carregando]);

  if (carregando) {
    return (
      <div className={styles.mensagemIA}>
        <AvatarIA />
        <div className={`${styles.bolha} ${styles.shimmer}`}>
          <div className={styles.linhaShimmer} />
          <div className={styles.linhaShimmer} style={{ width: "80%" }} />
          <div className={styles.linhaShimmer} style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mensagemIA}>
      <AvatarIA />
      <div className={styles.bolha}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={componentesMarkdown}
        >
          {textoExibido}
        </ReactMarkdown>
        {horario && <span className={styles.horario}>{horario}</span>}
      </div>
    </div>
  );
};

export default RespostaIA;