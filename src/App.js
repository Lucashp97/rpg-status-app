//import { useEffect, useMemo, useRef, useState } from "react";
//import escudo from "./assets/escudo.png.png";
//import coracao from "./assets/coracao.png.png";
//import silhueta from "./assets/Silhueta.png";

/* ===== STATUS ===== */

function getMensagemStatus(tipo, nivel) {
  const mensagens = {
    fome: ["Satisfeito", "-1 em teste DES/FOR", "-2 em teste DES/FOR", "1 Dado desvantagem", "1 Dado desvantagem, -6m movim."],
    sede: ["Hidratado", "-1 em teste DES/FOR", "-2 em teste DES/FOR", "1 Dado desvantagem", "1 Dado desvantagem, -6m movim."],
    exaustao: ["Em forma", "-1 em teste DES/FOR", "-2 em teste DES/FOR", "1 Dado desvantagem", "1 Dado desvantagem, -6m movim."],
    sanidade: ["Tranquilo", "-1 em teste CAR/DES", "-2 em teste CAR/DES", "1 Dado desvantagem", "1 Dado desvantagem, surtando"],
  };
  return mensagens[tipo]?.[nivel] ?? "";
}

/* ===== INVENTÁRIO ===== */

const CATS_ESSENCIAIS = [
  { id: "saude", titulo: "Saúde", icon: "🩹" },
  { id: "sustento", titulo: "Sustento", icon: "🍞" },
  { id: "municao", titulo: "Munição", icon: "🔫" },
  { id: "ferramentas", titulo: "Ferramentas", icon: "🧰" },
  { id: "materiais", titulo: "Materiais", icon: "🧱" },
];

const ESSENCIAIS_PADRAO = [
  { id: "bandagem", cat: "saude", icon: "🩹", nome: "Bandagem", qtd: 0 },
  { id: "remedio", cat: "saude", icon: "💊", nome: "Remédio", qtd: 0 },
  { id: "kit", cat: "saude", icon: "⛑️", nome: "Kit Primeiros Socorros", qtd: 0 },

  { id: "agua", cat: "sustento", icon: "💧", nome: "Água", qtd: 0 },
  { id: "comida", cat: "sustento", icon: "🥫", nome: "Comida", qtd: 0 },

  { id: "mun_leve", cat: "municao", icon: "🔫", nome: "Munição Leve", qtd: 0 },
  { id: "mun_media", cat: "municao", icon: "🧨", nome: "Munição Média", qtd: 0 },
  { id: "mun_pesada", cat: "municao", icon: "💥", nome: "Munição Pesada", qtd: 0 },

  { id: "pilhas", cat: "ferramentas", icon: "🔋", nome: "Pilhas", qtd: 0 },
  { id: "corda", cat: "ferramentas", icon: "🪢", nome: "Corda", qtd: 0 },
  { id: "ferramentas_gerais", cat: "ferramentas", icon: "🧰", nome: "Ferramentas gerais", qtd: 0 },

  { id: "sucata", cat: "materiais", icon: "🧱", nome: "Sucata / Peças", qtd: 0 },
  { id: "combustivel", cat: "materiais", icon: "⛽", nome: "Combustível", qtd: 0 },
  { id: "fita", cat: "materiais", icon: "🧵", nome: "Fita Adesiva", qtd: 0 },
  { id: "recursos", cat: "materiais", icon: "🪵", nome: "Recursos", qtd: 0 },
];

/* ===== EQUIPADO ===== */

const VEST_SLOTS = [
  { id: "cabeca", nome: "Cabeça", icon: "🪖", placeholder: "Ex: capacete militar rachado, boné, capuz..." },
  { id: "rosto", nome: "Rosto", icon: "😷", placeholder: "Ex: máscara, lenço, óculos, respirador..." },
  { id: "peito", nome: "Peito", icon: "🧥", placeholder: "Ex: jaqueta reforçada, colete, camisa grossa..." },
  { id: "costas", nome: "Costas", icon: "🎒", placeholder: "Ex: mochila 30L, bolsa, capa..." },
  { id: "cintura", nome: "Cintura", icon: "🪝", placeholder: "Ex: cinto tático, coldre, pochete..." },
  { id: "pernas", nome: "Pernas", icon: "👖", placeholder: "Ex: calça cargo rasgada, joelheiras..." },
  { id: "pes", nome: "Pés", icon: "🥾", placeholder: "Ex: bota trekking, tênis gasto..." },
  { id: "acessorio", nome: "Acessório", icon: "🎖️", placeholder: "Ex: medalhão, rádio preso ao colete..." },
];

const EQUIP_SLOTS_ARMAS = [
  { id: "maoPrimaria", nome: "Mão Primária", icon: "✋", tipo: "fogo" },
  { id: "maoSecundaria", nome: "Mão Secundária", icon: "✋", tipo: "fogo" },
  { id: "corpoACorpo", nome: "Corpo a Corpo", icon: "🗡️", tipo: "corpo" },
];

/* ===== NOTAS ===== */

const NOTAS_CATS = [
  { id: "geral", nome: "Geral", icon: "📝" },
  { id: "missao", nome: "Missões", icon: "🎯" },
  { id: "npc", nome: "NPCs", icon: "🧑‍🤝‍🧑" },
  { id: "local", nome: "Locais", icon: "🗺️" },
  { id: "item", nome: "Itens / Recompensas", icon: "🎒" },
  { id: "pista", nome: "Pistas / Segredos", icon: "🕵️" },
];

function catMeta(catId) {
  return NOTAS_CATS.find((c) => c.id === catId) || NOTAS_CATS[0];
}

function formatDateBR(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "";
  }
}

const ESTADO_INICIAL = {
  vida: { atual: 20, maxima: 20 },
  ca: 12,
  status: { fome: 0, sede: 0, sanidade: 0, exaustao: 0 },
  inventario: {
    essenciais: ESSENCIAIS_PADRAO,
    outros: [],
    armas: { fogo: [], corpo: [] },
  },
  equipado: {
    vestimentas: {
      cabeca: "",
      rosto: "",
      peito: "",
      costas: "",
      cintura: "",
      pernas: "",
      pes: "",
      acessorio: "",
    },
    armas: {
      maoPrimaria: null,
      maoSecundaria: null,
      corpoACorpo: null,
    },
  },
  notas: {
    itens: [], // {id, cat, titulo, texto, tags[], pinned, createdAt, updatedAt}
  },
};

function mergeComPadrao(parsed) {
  const safe = parsed && typeof parsed === "object" ? parsed : {};

  const vidaRaw = safe.vida && typeof safe.vida === "object" ? safe.vida : {};
  const maxVida = Number.isFinite(Number(vidaRaw.maxima)) ? Math.max(1, Number(vidaRaw.maxima)) : ESTADO_INICIAL.vida.maxima;
  const atualVida = Number.isFinite(Number(vidaRaw.atual)) ? Number(vidaRaw.atual) : ESTADO_INICIAL.vida.atual;

  const vida = {
    maxima: maxVida,
    atual: Math.max(-1, Math.min(maxVida, atualVida)),
  };

  const status = { ...ESTADO_INICIAL.status, ...(safe.status || {}) };

  const inv = safe.inventario && typeof safe.inventario === "object" ? safe.inventario : {};
  const essenciaisSalvos = Array.isArray(inv.essenciais) ? inv.essenciais : null;
  const outrosSalvos = Array.isArray(inv.outros) ? inv.outros : [];

  const armasObj = inv.armas && typeof inv.armas === "object" ? inv.armas : { fogo: [], corpo: [] };
  const armasFogo = Array.isArray(armasObj.fogo) ? armasObj.fogo : [];
  const armasCorpo = Array.isArray(armasObj.corpo) ? armasObj.corpo : [];

  const essenciaisNormalizados = (() => {
    if (!essenciaisSalvos) return ESSENCIAIS_PADRAO;
    const byId = new Map(essenciaisSalvos.map((it) => [it.id, it]));
    return ESSENCIAIS_PADRAO.map((base) => {
      const saved = byId.get(base.id);
      if (!saved) return base;
      return { ...base, qtd: Number.isFinite(Number(saved.qtd)) ? Math.max(0, Number(saved.qtd)) : base.qtd };
    });
  })();

  const outrosNormalizados = outrosSalvos
    .map((it) => ({
      id: String(it.id ?? `${Date.now()}_${Math.random()}`),
      icon: "📦",
      nome: String(it.nome ?? "").trim(),
      qtd: Number.isFinite(Number(it.qtd)) ? Math.max(0, Number(it.qtd)) : 1,
    }))
    .filter((it) => it.nome);

  const normalizarArmaFogo = (it) => ({
    id: String(it.id ?? `${Date.now()}_${Math.random()}`),
    icon: "🔫",
    nome: String(it.nome ?? "").trim(),
    apelido: String(it.apelido ?? "").trim(),
    dano: String(it.dano ?? "").trim(),
    municao: String(it.municao ?? "Leve"),
    usos: Number.isFinite(Number(it.usos)) ? Math.max(0, Number(it.usos)) : 0,
    desc: String(it.desc ?? "").trim(),
    historia: String(it.historia ?? "").trim(),
  });

  const normalizarArmaCorpo = (it) => ({
    id: String(it.id ?? `${Date.now()}_${Math.random()}`),
    icon: "🗡️",
    nome: String(it.nome ?? "").trim(),
    apelido: String(it.apelido ?? "").trim(),
    dano: String(it.dano ?? "").trim(),
    usos: Number.isFinite(Number(it.usos)) ? Math.max(0, Number(it.usos)) : 0,
    desc: String(it.desc ?? "").trim(),
    historia: String(it.historia ?? "").trim(),
  });

  const armasFogoNorm = armasFogo.map(normalizarArmaFogo).filter((a) => a.nome);
  const armasCorpoNorm = armasCorpo.map(normalizarArmaCorpo).filter((a) => a.nome);

  const eq = safe.equipado && typeof safe.equipado === "object" ? safe.equipado : {};
  const vest = eq.vestimentas && typeof eq.vestimentas === "object" ? eq.vestimentas : {};
  const eqArmas = eq.armas && typeof eq.armas === "object" ? eq.armas : {};

  const equipadoNormalizado = {
    vestimentas: {
      cabeca: String(vest.cabeca ?? ""),
      rosto: String(vest.rosto ?? ""),
      peito: String(vest.peito ?? ""),
      costas: String(vest.costas ?? ""),
      cintura: String(vest.cintura ?? ""),
      pernas: String(vest.pernas ?? ""),
      pes: String(vest.pes ?? ""),
      acessorio: String(vest.acessorio ?? ""),
    },
    armas: {
      maoPrimaria: eqArmas.maoPrimaria ?? null,
      maoSecundaria: eqArmas.maoSecundaria ?? null,
      corpoACorpo: eqArmas.corpoACorpo ?? null,
    },
  };

  const notasSafe = safe.notas && typeof safe.notas === "object" ? safe.notas : {};
  const notasItens = Array.isArray(notasSafe.itens) ? notasSafe.itens : [];
  const notasNorm = notasItens
    .map((n) => ({
      id: String(n.id ?? `${Date.now()}_${Math.random()}`),
      cat: String(n.cat ?? "geral"),
      titulo: String(n.titulo ?? "").trim(),
      texto: String(n.texto ?? "").trim(),
      tags: Array.isArray(n.tags) ? n.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12) : [],
      pinned: !!n.pinned,
      createdAt: String(n.createdAt ?? new Date().toISOString()),
      updatedAt: String(n.updatedAt ?? String(n.createdAt ?? new Date().toISOString())),
    }))
    .filter((n) => n.titulo || n.texto);

  return {
    ...ESTADO_INICIAL,
    ...safe,
    vida,
    status,
    inventario: {
      essenciais: essenciaisNormalizados,
      outros: outrosNormalizados,
      armas: { fogo: armasFogoNorm, corpo: armasCorpoNorm },
    },
    equipado: equipadoNormalizado,
    notas: { itens: notasNorm },
  };
}

/* =========================
   COMPONENTES (FORA DO APP)
========================= */

function CardStatus({ nome, tipo, valor, alterarStatus }) {
  const max = 4;

  return (
    <section style={styles.statusCard}>
      <div style={styles.statusHeader}>
        <div style={styles.statusTitulo}>{nome}</div>

        <div style={styles.statusPips} aria-label={`Nível ${valor} de ${max}`}>
          {Array.from({ length: max + 1 }).map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.statusPip,
                ...(i <= valor ? (valor === 0 ? styles.statusPipAtivoOk : styles.statusPipAtivo) : null),
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          ...styles.statusMensagemNova,
          color: valor === 0 ? "#4caf50" : "#ff5252",
          background: valor === 0 ? "rgba(76, 175, 80, 0.15)" : "rgba(0,0,0,0.35)",
        }}
      >
        {getMensagemStatus(tipo, valor)}
      </div>

      <div style={styles.statusFooter}>
        <button style={styles.statusBtn} onClick={() => alterarStatus(tipo, -1)} aria-label={`Diminuir ${tipo}`}>
          −
        </button>

        <div style={styles.statusNivel}>
          {valor}/{max}
        </div>

        <button style={styles.statusBtn} onClick={() => alterarStatus(tipo, 1)} aria-label={`Aumentar ${tipo}`}>
          +
        </button>
      </div>
    </section>
  );
}

function InventarioOutros({ ficha, adicionarOutro, alterarQtdOutro, removerOutro }) {
  const [nome, setNome] = useState("");

  return (
    <div style={styles.invBox}>
      <div style={styles.invFormRow}>
        <input
          style={styles.invInput}
          placeholder="Adicionar item (ex: Rádio, Chave, Mapa...)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button
          style={styles.invAdd}
          onClick={() => {
            adicionarOutro(nome);
            setNome("");
          }}
        >
          Adicionar
        </button>
      </div>

      <div style={styles.invLista}>
        {(ficha.inventario?.outros || []).length === 0 ? (
          <div style={styles.invVazio}>Nenhum item extra.</div>
        ) : (
          (ficha.inventario.outros || []).map((it) => (
            <div key={it.id} style={styles.invLinhaItem}>
              <div style={styles.invItemLeft}>
                <span style={styles.invItemIcon}>{it.icon || "📦"}</span>
                <span style={styles.invItemNome}>{it.nome}</span>
              </div>

              <div style={styles.invItemRight}>
                <button style={styles.invBtn} onClick={() => alterarQtdOutro(it.id, -1)}>
                  −
                </button>
                <span style={styles.invQtd}>{it.qtd}</span>
                <button style={styles.invBtn} onClick={() => alterarQtdOutro(it.id, 1)}>
                  +
                </button>

                <button style={styles.invRemover} onClick={() => removerOutro(it.id)}>
                  x
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ArmasFogo({ ficha, setArmaAberta, adicionarArmaFogo }) {
  const [mostrarForm, setMostrarForm] = useState(false);

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dano, setDano] = useState("");
  const [municao, setMunicao] = useState("Leve");
  const [usos, setUsos] = useState(0);
  const [desc, setDesc] = useState("");
  const [historia, setHistoria] = useState("");

  const lista = ficha.inventario?.armas?.fogo || [];

  return (
    <div style={styles.invBox}>
      <div style={styles.armaHeaderRow}>
        <div style={styles.armaHeaderTitle}>
          <span style={{ fontSize: 18 }}>🔫</span>
          <span>Armas de Fogo</span>
        </div>

        <button style={styles.armaToggleBtn} onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? "Fechar" : "+ Adicionar"}
        </button>
      </div>

      {mostrarForm && (
        <div style={styles.armaForm}>
          <input style={styles.invInput} placeholder="Nome (ex: Pistola 9mm)" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={styles.invInput} placeholder="Apelido (opcional)" value={apelido} onChange={(e) => setApelido(e.target.value)} />

          <div style={styles.armaFormRow}>
            <input style={styles.danoInput} placeholder="Dano (ex: 2d6 / 1d8)" value={dano} onChange={(e) => setDano(e.target.value)} />
            <select style={styles.municaoSelect} value={municao} onChange={(e) => setMunicao(e.target.value)}>
              <option value="Leve">Munição Leve</option>
              <option value="Média">Munição Média</option>
              <option value="Pesada">Munição Pesada</option>
            </select>
          </div>

          <div style={styles.armaFormRow}>
            <input style={styles.usosInput} type="number" min="0" placeholder="Usos" value={usos} onChange={(e) => setUsos(e.target.value)} />
            <button
              style={styles.invAdd}
              onClick={() => {
                adicionarArmaFogo({ nome, apelido, dano, municao, usos, desc, historia });
                setNome("");
                setApelido("");
                setDano("");
                setMunicao("Leve");
                setUsos(0);
                setDesc("");
                setHistoria("");
                setMostrarForm(false);
              }}
            >
              Salvar
            </button>
          </div>

          <textarea style={styles.descInput} placeholder="Descrição precisa" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          <textarea style={styles.descInput} placeholder="Histórico (opcional)" value={historia} onChange={(e) => setHistoria(e.target.value)} rows={2} />
        </div>
      )}

      <div style={styles.invLista}>
        {lista.length === 0 ? (
          <div style={styles.invVazio}>Nenhuma arma de fogo cadastrada.</div>
        ) : (
          lista.map((it) => (
            <button key={it.id} style={styles.armaCardBtnDestaque} onClick={() => setArmaAberta({ tipo: "fogo", id: it.id })}>
              <div style={styles.armaCardTop}>
                <div style={styles.armaNomeBox}>
                  <span style={styles.armaIconGrande}>🔫</span>
                  <div style={styles.armaNomeStack}>
                    <div style={styles.armaNomeGrande}>{it.nome}</div>
                    {it.apelido ? <div style={styles.apelidoLinha}>“{it.apelido}”</div> : null}
                  </div>
                </div>
                <div style={styles.armaChevron}>›</div>
              </div>

              <div style={styles.armaBadgesLinha}>
                <span style={styles.badgeStrong}>DANO: {it.dano || "—"}</span>
                <span style={styles.badgeStrong}>MUNIÇÃO: {it.municao || "—"}</span>
                <span style={styles.badgeStrong}>USOS: {it.usos}</span>
              </div>

              {it.desc ? <div style={styles.armaDescClamp}>{it.desc}</div> : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ArmasCorpo({ ficha, setArmaAberta, adicionarArmaCorpo }) {
  const [mostrarForm, setMostrarForm] = useState(false);

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [dano, setDano] = useState("");
  const [usos, setUsos] = useState(0);
  const [desc, setDesc] = useState("");
  const [historia, setHistoria] = useState("");

  const lista = ficha.inventario?.armas?.corpo || [];

  return (
    <div style={styles.invBox}>
      <div style={styles.armaHeaderRow}>
        <div style={styles.armaHeaderTitle}>
          <span style={{ fontSize: 18 }}>🗡️</span>
          <span>Corpo a Corpo</span>
        </div>

        <button style={styles.armaToggleBtn} onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? "Fechar" : "+ Adicionar"}
        </button>
      </div>

      {mostrarForm && (
        <div style={styles.armaForm}>
          <input style={styles.invInput} placeholder="Nome (ex: Machado improvisado)" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={styles.invInput} placeholder="Apelido (opcional)" value={apelido} onChange={(e) => setApelido(e.target.value)} />

          <div style={styles.armaFormRow}>
            <input style={styles.danoInput} placeholder="Dano (ex: 1d6 / contusão)" value={dano} onChange={(e) => setDano(e.target.value)} />
            <input style={styles.usosInput} type="number" min="0" placeholder="Usos" value={usos} onChange={(e) => setUsos(e.target.value)} />
          </div>

          <button
            style={styles.invAddWide}
            onClick={() => {
              adicionarArmaCorpo({ nome, apelido, dano, usos, desc, historia });
              setNome("");
              setApelido("");
              setDano("");
              setUsos(0);
              setDesc("");
              setHistoria("");
              setMostrarForm(false);
            }}
          >
            Salvar
          </button>

          <textarea style={styles.descInput} placeholder="Descrição precisa" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          <textarea style={styles.descInput} placeholder="Histórico (opcional)" value={historia} onChange={(e) => setHistoria(e.target.value)} rows={2} />
        </div>
      )}

      <div style={styles.invLista}>
        {lista.length === 0 ? (
          <div style={styles.invVazio}>Nenhuma arma corpo a corpo cadastrada.</div>
        ) : (
          lista.map((it) => (
            <button key={it.id} style={styles.armaCardBtnDestaque} onClick={() => setArmaAberta({ tipo: "corpo", id: it.id })}>
              <div style={styles.armaCardTop}>
                <div style={styles.armaNomeBox}>
                  <span style={styles.armaIconGrande}>🗡️</span>
                  <div style={styles.armaNomeStack}>
                    <div style={styles.armaNomeGrande}>{it.nome}</div>
                    {it.apelido ? <div style={styles.apelidoLinha}>“{it.apelido}”</div> : null}
                  </div>
                </div>
                <div style={styles.armaChevron}>›</div>
              </div>

              <div style={styles.armaBadgesLinha}>
                <span style={styles.badgeStrong}>DANO: {it.dano || "—"}</span>
                <span style={styles.badgeStrong}>USOS: {it.usos}</span>
              </div>

              {it.desc ? <div style={styles.armaDescClamp}>{it.desc}</div> : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function TelaMorte({ onReanimar }) {
  return (
    <div style={styles.deathScreen}>
      <div style={styles.deathCard}>
        <div style={styles.deathSkull}>☠️</div>
        <div style={styles.deathTitle}>MORTO</div>
        <div style={styles.deathText}>Sua vida chegou a -1. Para voltar ao jogo, aumente a vida para 0 (Desacordado) ou mais.</div>
        <button style={styles.deathBtn} onClick={onReanimar}>
          +1 Vida
        </button>
      </div>
    </div>
  );
}

function ModalConfirmar({ open, titulo = "Confirmar", texto, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onCancel} role="dialog" aria-modal="true">
      <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTopBar}>
          <button style={styles.modalClose} onClick={onCancel}>
            Cancelar
          </button>
          <div style={styles.modalTitle}>{titulo}</div>
          <button style={styles.modalEquip} onClick={onConfirm}>
            OK
          </button>
        </div>

        <div style={styles.modalSection}>
          <div style={styles.modalText}>{texto}</div>
        </div>

        <div style={styles.modalBottom}>
          <button style={styles.noteRemoveBtn} onClick={onConfirm}>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalImportarFicha({ open, onClose, onImport }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (open) setTexto("");
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTopBar}>
          <button style={styles.modalClose} onClick={onClose}>
            Fechar
          </button>
          <div style={styles.modalTitle}>Importar ficha</div>
          <button
            style={styles.modalEquip}
            onClick={() => {
              onImport(texto);
            }}
          >
            Importar
          </button>
        </div>

        <div style={styles.modalSection}>
          <div style={{ ...styles.modalSectionTitle, marginBottom: 8 }}>Cole o JSON aqui</div>
          <textarea
            style={styles.importTextarea}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder='Ex: {"vida":{"atual":20,"maxima":20}, ... }'
            rows={10}
          />
          <div style={styles.importHint}>
            Dica: use <b>Exportar</b> em outro celular/PC e cole aqui. Isso substitui a ficha atual.
          </div>
        </div>

        <div style={styles.modalBottom}>
          <button style={styles.noteRemoveBtn} onClick={() => onImport(texto)}>
            Importar agora
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalEquipPicker({ equipPicker, fecharEquipPicker, ficha, equiparArma, desequiparSlot }) {
  if (!equipPicker.open) return null;

  const { slotId, tipo } = equipPicker;
  const lista = tipo === "corpo" ? ficha.inventario?.armas?.corpo || [] : ficha.inventario?.armas?.fogo || [];

  return (
    <div style={styles.modalBackdrop} onClick={fecharEquipPicker} role="dialog" aria-modal="true">
      <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTopBar}>
          <button style={styles.modalClose} onClick={fecharEquipPicker}>
            Fechar
          </button>
          <div style={styles.modalTitle}>{tipo === "corpo" ? "Escolher arma corpo a corpo" : "Escolher arma de fogo"}</div>

          <button
            style={styles.modalEquip}
            onClick={() => {
              desequiparSlot(slotId);
              fecharEquipPicker();
            }}
          >
            Limpar
          </button>
        </div>

        <div style={{ ...styles.modalSection, marginTop: 0 }}>
          {lista.length === 0 ? (
            <div style={styles.invVazio}>Nenhuma arma cadastrada nessa categoria.</div>
          ) : (
            <div style={styles.invLista}>
              {lista.map((a) => (
                <button
                  key={a.id}
                  style={{ ...styles.armaCardBtnDestaque, padding: 12 }}
                  onClick={() => {
                    equiparArma(slotId, tipo, a.id);
                    fecharEquipPicker();
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 22 }}>{tipo === "corpo" ? "🗡️" : "🔫"}</div>
                    <div style={{ fontWeight: 900, color: "#fff" }}>{a.nome}</div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={styles.badgeStrong}>DANO: {a.dano || "—"}</span>
                    {"municao" in a ? <span style={styles.badgeStrong}>MUNIÇÃO: {a.municao || "—"}</span> : null}
                    <span style={styles.badgeStrong}>USOS: {a.usos}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalArmaDetalhe({
  armaAberta,
  setArmaAberta,
  encontrarArmaAberta,
  alterarUsosArma,
  removerArma,
  slotsQueContemArma,
  nomeSlot,
  desequiparArmaPorId,
  irParaEquipado,
}) {
  const arma = encontrarArmaAberta();
  if (!armaAberta || !arma) return null;

  const isFogo = armaAberta.tipo === "fogo";
  const icon = isFogo ? "🔫" : "🗡️";
  const slotsOndeEsta = slotsQueContemArma(armaAberta.tipo, arma.id);

  return (
    <div style={styles.modalBackdrop} onClick={() => setArmaAberta(null)} role="dialog" aria-modal="true">
      <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTopBar}>
          <button style={styles.modalClose} onClick={() => setArmaAberta(null)}>
            Fechar
          </button>
          <div style={styles.modalTitle}>Detalhes da arma</div>

          {/* Simplificação: não equipa aqui (evita caminhos duplicados). Vai pra aba Equipado. */}
          <button
            style={styles.modalEquip}
            onClick={() => {
              setArmaAberta(null);
              irParaEquipado();
            }}
          >
            Ir p/ Equipado
          </button>
        </div>

        <div style={styles.modalHero}>
          <div style={styles.modalNomeLinha}>
            <span style={styles.modalIcon}>{icon}</span>
            <div style={styles.modalNomeBox}>
              <div style={styles.modalNome}>{arma.nome}</div>
              {arma.apelido ? <div style={styles.modalApelido}>“{arma.apelido}”</div> : null}
            </div>
          </div>

          <div style={styles.modalBadges}>
            <span style={styles.badgeBig}>DANO: {arma.dano || "—"}</span>
            {isFogo ? <span style={styles.badgeBig}>MUNIÇÃO: {arma.municao || "—"}</span> : null}
            <span style={styles.badgeBig}>USOS: {arma.usos}</span>
          </div>

          <div style={styles.modalUsosRow}>
            <button style={styles.modalUsosBtn} onClick={() => alterarUsosArma(armaAberta.tipo, arma.id, -1)}>
              −
            </button>
            <div style={styles.modalUsosTxt}>Ajustar usos</div>
            <button style={styles.modalUsosBtn} onClick={() => alterarUsosArma(armaAberta.tipo, arma.id, 1)}>
              +
            </button>
          </div>

          {slotsOndeEsta.length > 0 ? (
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <div style={styles.eqBadge}>
                Equipada em: <span style={styles.eqBadgeStrong}>{slotsOndeEsta.map((s) => nomeSlot(s)).join(", ")}</span>
              </div>
              <button style={{ ...styles.modalEquip, justifySelf: "stretch", width: "100%" }} onClick={() => desequiparArmaPorId(armaAberta.tipo, arma.id)}>
                Desequipar
              </button>
            </div>
          ) : null}
        </div>

        {arma.desc ? (
          <div style={styles.modalSection}>
            <div style={styles.modalSectionTitle}>Descrição</div>
            <div style={styles.modalText}>{arma.desc}</div>
          </div>
        ) : null}

        {arma.historia ? (
          <div style={styles.modalSection}>
            <div style={styles.modalSectionTitle}>Histórico</div>
            <div style={styles.modalText}>{arma.historia}</div>
          </div>
        ) : null}

        <div style={styles.modalBottom}>
          <button style={styles.modalRemove} onClick={() => removerArma(armaAberta.tipo, arma.id)}>
            Remover arma
          </button>
        </div>
      </div>
    </div>
  );
}

function EquipadoTela({ ficha, setVest, abrirEquipPicker, resolverArma, desequiparSlot, setArmaAberta }) {
  return (
    <main style={styles.painel}>
      <div style={styles.invTitulo}>Equipado</div>

      <section
        style={{
          ...styles.eqPanel,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.86))`,
        }}
      >
        <div style={styles.eqPanelHeader}>
          <div style={styles.eqPanelTitle}>Vestimentas (descrição)</div>
          <div style={styles.eqPanelSub}>Escreva com detalhes. O texto fica bem visível e salvo aqui.</div>
        </div>

        <div style={styles.eqFields}>
          {VEST_SLOTS.map((s) => (
            <div key={s.id} style={styles.eqFieldRow}>
              <div style={styles.eqFieldLeft}>
                <div style={styles.eqFieldIconBox}>
                  <span style={styles.eqFieldIcon}>{s.icon}</span>
                </div>
                <div style={styles.eqFieldLabelBox}>
                  <div style={styles.eqFieldLabel}>{s.nome}</div>
                  <div style={styles.eqFieldHint}>{s.placeholder}</div>
                </div>
              </div>

              <textarea
                rows={2}
                style={styles.eqFieldInput}
                value={ficha.equipado?.vestimentas?.[s.id] || ""}
                onChange={(e) => setVest(s.id, e.target.value)}
                placeholder={s.placeholder}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={styles.eqPanelTitle}>Armas Equipadas</div>
          <div style={styles.eqPanelSub}>Use “Trocar” para escolher outra arma, ou “Limpar” para desequipar.</div>

          <div style={styles.eqWeaponsGrid} className="eqWeaponsGrid">
            {EQUIP_SLOTS_ARMAS.map((slot) => {
              const arma = resolverArma(slot.id);

              return (
                <div key={slot.id} style={styles.eqWeaponCard}>
                  <div style={styles.eqWeaponTop}>
                    <div style={styles.eqWeaponLeft}>
                      <div style={styles.eqWeaponIconBox}>
                        <span style={styles.eqWeaponIcon}>{slot.icon}</span>
                      </div>

                      <div style={styles.eqWeaponText}>
                        <div style={styles.eqWeaponTitle}>{slot.nome}</div>
                        <div style={styles.eqWeaponName}>{arma ? arma.nome : "Nenhuma arma equipada"}</div>
                      </div>
                    </div>
                  </div>

                  {arma ? (
                    <div style={styles.eqWeaponBadges}>
                      <span style={styles.eqBadgeStrong}>DANO: {arma.dano || "—"}</span>
                      {arma.tipo === "fogo" ? <span style={styles.eqBadgeStrong}>MUNIÇÃO: {arma.municao || "—"}</span> : null}
                      <span style={styles.eqBadgeStrong}>USOS: {arma.usos}</span>
                    </div>
                  ) : (
                    <div style={styles.eqEmptyHint}>Toque em “Escolher” para equipar uma arma.</div>
                  )}

                  <div style={styles.eqWeaponActions} className="eqWeaponActions">
                    <button style={styles.eqActionPrimary} onClick={() => abrirEquipPicker(slot.id, slot.tipo)}>
                      {arma ? "Trocar" : "Escolher"}
                    </button>

                    <button style={{ ...styles.eqActionGhost, opacity: arma ? 1 : 0.55 }} onClick={() => (arma ? desequiparSlot(slot.id) : null)} disabled={!arma}>
                      Limpar
                    </button>

                    <button
                      style={{ ...styles.eqActionGhost, opacity: arma ? 1 : 0.55 }}
                      onClick={() => (arma ? setArmaAberta({ tipo: arma.tipo, id: arma.id }) : null)}
                      disabled={!arma}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== NOTAS TELA ===== */

function NotasTela({
  ficha,
  adicionarNota,
  editarNota,
  removerNota,
  togglePinNota,
  setAbaAtiva,
  abrirConfirmRemoverNota,
  exportarFicha,
  abrirImportarFicha,
}) {
  const [cat, setCat] = useState("geral");
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [tags, setTags] = useState("");

  const [filtroCat, setFiltroCat] = useState("todas");
  const [busca, setBusca] = useState("");

  // drafts locais pra digitar sem travar (e com commit por debounce)
  const [drafts, setDrafts] = useState({}); // { [id]: {titulo?, texto?, cat?, tagsString?} }
  const timersRef = useRef({}); // { [id_field]: timeoutId }

  const itens = ficha.notas?.itens || [];

  useEffect(() => {
    // limpa drafts de notas removidas
    setDrafts((prev) => {
      const ids = new Set((ficha.notas?.itens || []).map((n) => n.id));
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (!ids.has(k)) delete next[k];
      }
      return next;
    });
  }, [ficha.notas]);

  const listaFiltrada = useMemo(() => {
    const q = (busca || "").trim().toLowerCase();

    const base = itens.filter((n) => {
      if (filtroCat !== "todas" && n.cat !== filtroCat) return false;
      if (!q) return true;

      const hay = `${n.titulo}\n${n.texto}\n${(n.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    return base.sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [itens, filtroCat, busca]);

  function limparForm() {
    setCat("geral");
    setTitulo("");
    setTexto("");
    setTags("");
  }

  function salvar() {
    const tituloOk = titulo.trim();
    const textoOk = texto.trim();
    if (!tituloOk && !textoOk) return;

    const tagsArr = (tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12);

    adicionarNota({
      cat,
      titulo: tituloOk || "(Sem título)",
      texto: textoOk,
      tags: tagsArr,
    });

    limparForm();
  }

  function templateMissao() {
    setCat("missao");
    setTitulo("Missão: (título curto)");
    setTexto(
      [
        "NPC: (quem pediu?)",
        "Objetivo: (o que quer que façam?)",
        "Local: (onde?)",
        "Prazo/Condição: (se houver)",
        "Recompensa: (se houver)",
        "Estado: (aberta / em andamento / concluída / falhou)",
      ].join("\n")
    );
    setTags("missao, prioridade");
  }

  function templateNPC() {
    setCat("npc");
    setTitulo("NPC: (nome)");
    setTexto(["Aparência: ", "Personalidade: ", "Motivação: ", "Relação com o grupo: ", "Última vez visto: ", "Anotações: "].join("\n"));
    setTags("npc");
  }

  function templateLocal() {
    setCat("local");
    setTitulo("Local: (nome)");
    setTexto(["Descrição rápida: ", "Perigos/ameaças: ", "Pontos de interesse: ", "Pistas encontradas: ", "Anotações: "].join("\n"));
    setTags("local");
  }

  function setDraft(id, patch) {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  }

  function scheduleCommit(id, patch, delay = 250) {
    const fields = Object.keys(patch);
    for (const f of fields) {
      const key = `${id}_${f}`;
      if (timersRef.current[key]) clearTimeout(timersRef.current[key]);
      timersRef.current[key] = setTimeout(() => {
        editarNota(id, patch);
        timersRef.current[key] = null;
      }, delay);
    }
  }

  function commitNow(id, patch) {
    // cancela timers correspondentes e commita imediatamente
    for (const f of Object.keys(patch)) {
      const key = `${id}_${f}`;
      if (timersRef.current[key]) clearTimeout(timersRef.current[key]);
      timersRef.current[key] = null;
    }
    editarNota(id, patch);
  }

  return (
    <main style={styles.painel}>
      <div style={styles.invTitulo}>Notas</div>

      <section style={styles.notesPanel}>
        <div style={styles.notesHeaderRow}>
          <div>
            <div style={styles.notesTitle}>Anotações da Campanha</div>
            <div style={styles.notesSub}>Missões, NPCs, pistas, itens e qualquer coisa importante.</div>
          </div>

          <div style={styles.notesHeaderActions}>
            <button style={styles.notesHeaderBtn} onClick={exportarFicha}>
              ⬆️ Exportar
            </button>
            <button style={styles.notesHeaderBtnGhost} onClick={abrirImportarFicha}>
              ⬇️ Importar
            </button>
          </div>
        </div>

        <div style={styles.notesTemplatesRow}>
          <button style={styles.notesTemplateBtn} onClick={templateMissao}>
            🎯 Template Missão
          </button>
          <button style={styles.notesTemplateBtn} onClick={templateNPC}>
            🧑‍🤝‍🧑 Template NPC
          </button>
          <button style={styles.notesTemplateBtn} onClick={templateLocal}>
            🗺️ Template Local
          </button>
          <button style={styles.notesTemplateBtnGhost} onClick={() => setAbaAtiva("inventario")}>
            Ir pro Inventário
          </button>
        </div>

        <div style={styles.notesForm}>
          <div style={styles.notesFormRow}>
            <select style={styles.notesSelect} value={cat} onChange={(e) => setCat(e.target.value)}>
              {NOTAS_CATS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <input
              style={styles.notesInput}
              placeholder="Título (ex: Missão do rádio / NPC: Marta / Hospital fechado)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <textarea style={styles.notesTextarea} placeholder="Escreva aqui os detalhes..." value={texto} onChange={(e) => setTexto(e.target.value)} rows={6} />

          <div style={styles.notesFormRow}>
            <input style={styles.notesInput} placeholder="Tags (separe por vírgula) ex: missao, prioridade, hospital" value={tags} onChange={(e) => setTags(e.target.value)} />
            <button style={styles.notesSaveBtn} onClick={salvar}>
              Salvar
            </button>
          </div>

          <div style={styles.notesHint}>
            Dica: use tags para achar rápido (ex: <b>“hospital”</b>, <b>“bando”</b>, <b>“chave”</b>).
          </div>
        </div>
      </section>

      <section style={styles.notesPanel}>
        <div style={styles.notesListTop}>
          <div style={styles.notesTitle}>Minhas Notas</div>

          <div style={styles.notesFilters}>
            <select style={styles.notesSelectSmall} value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}>
              <option value="todas">Todas</option>
              {NOTAS_CATS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <input style={styles.notesSearch} placeholder="Buscar (título, texto ou tags)" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        {listaFiltrada.length === 0 ? (
          <div style={styles.invVazio}>Nenhuma nota encontrada.</div>
        ) : (
          <div style={styles.notesList}>
            {listaFiltrada.map((n) => {
              const meta = catMeta(n.cat);
              const d = drafts[n.id] || {};
              const textoVal = d.texto ?? n.texto ?? "";
              const tituloVal = d.titulo ?? n.titulo ?? "";
              const catVal = d.cat ?? n.cat ?? "geral";
              const tagsStrVal = d.tagsString ?? (Array.isArray(n.tags) ? n.tags.join(", ") : "");

              return (
                <details key={n.id} style={styles.noteCard} open={false}>
                  <summary style={styles.noteSummary}>
                    <div style={styles.noteSummaryLeft}>
                      <span style={styles.noteCatIcon}>{meta.icon}</span>
                      <div style={styles.noteSummaryText}>
                        <div style={styles.noteTitleRow}>
                          <span style={styles.noteTitleText}>{(tituloVal || "").trim() || "(Sem título)"}</span>
                          {n.pinned ? <span style={styles.notePinned}>📌</span> : null}
                        </div>
                        <div style={styles.noteMetaRow}>
                          <span style={styles.noteMetaChip}>{meta.nome}</span>
                          <span style={styles.noteMetaDim}>Atualizado: {formatDateBR(n.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.noteSummaryRight}>
                      <button
                        style={styles.noteMiniBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          togglePinNota(n.id);
                        }}
                      >
                        {n.pinned ? "Desafixar" : "Fixar"}
                      </button>
                    </div>
                  </summary>

                  <div style={styles.noteBody}>
                    <div style={styles.noteTagsRow}>
                      {tagsStrVal.trim() ? (
                        tagsStrVal
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean)
                          .slice(0, 12)
                          .map((t) => (
                            <span key={t} style={styles.noteTag}>
                              #{t}
                            </span>
                          ))
                      ) : (
                        <span style={styles.noteMetaDim}>Sem tags</span>
                      )}
                    </div>

                    <textarea
                      style={styles.noteEditArea}
                      value={textoVal}
                      onChange={(e) => {
                        setDraft(n.id, { texto: e.target.value });
                        scheduleCommit(n.id, { texto: e.target.value });
                      }}
                      onBlur={() => {
                        commitNow(n.id, { texto: textoVal });
                      }}
                      rows={6}
                      placeholder="Detalhes..."
                    />

                    <div style={styles.noteEditRow}>
                      <input
                        style={styles.noteEditTitle}
                        value={tituloVal}
                        onChange={(e) => {
                          setDraft(n.id, { titulo: e.target.value });
                          scheduleCommit(n.id, { titulo: e.target.value });
                        }}
                        onBlur={() => commitNow(n.id, { titulo: tituloVal })}
                        placeholder="Título"
                      />

                      <select
                        style={styles.notesSelectSmall}
                        value={catVal}
                        onChange={(e) => {
                          setDraft(n.id, { cat: e.target.value });
                          commitNow(n.id, { cat: e.target.value });
                        }}
                      >
                        {NOTAS_CATS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.noteEditRow}>
                      <input
                        style={styles.noteEditTitle}
                        value={tagsStrVal}
                        onChange={(e) => {
                          setDraft(n.id, { tagsString: e.target.value });
                          // debounce pra não ficar pesado
                          const arr = e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                            .slice(0, 12);
                          scheduleCommit(n.id, { tags: arr }, 350);
                        }}
                        onBlur={() => {
                          const arr = tagsStrVal
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                            .slice(0, 12);
                          commitNow(n.id, { tags: arr });
                        }}
                        placeholder="Tags (vírgula) ex: hospital, chave, npc"
                      />

                      <button style={styles.noteRemoveBtn} onClick={() => abrirConfirmRemoverNota(n.id)}>
                        Remover
                      </button>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

/* =========================
            APP
========================= */

export default function App() {
  const [ficha, setFicha] = useState(ESTADO_INICIAL);
  const [abaAtiva, setAbaAtiva] = useState("status"); // status | inventario | equipado | notas
  const [editandoVidaMax, setEditandoVidaMax] = useState(false);

  const [armaAberta, setArmaAberta] = useState(null);
  const [equipPicker, setEquipPicker] = useState({ open: false, slotId: null, tipo: "fogo" });

  // Modal de confirmação (remove notas) — substitui confirm()
  const [confirmModal, setConfirmModal] = useState({ open: false, notaId: null });

  // Modal de importar ficha
  const [importModalOpen, setImportModalOpen] = useState(false);

  const saveTimerRef = useRef(null);

  /* ===== LOCAL STORAGE ===== */
  useEffect(() => {
    const salvo = localStorage.getItem("survivor_ficha");
    if (!salvo) return;

    try {
      const parsed = JSON.parse(salvo);
      setFicha(mergeComPadrao(parsed));
    } catch {
      localStorage.removeItem("survivor_ficha");
    }
  }, []);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("survivor_ficha", JSON.stringify(ficha));
      } catch {}
    }, 350);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [ficha]);

  /* ===== FUNÇÕES GERAIS ===== */

  function alterarVida(valor) {
    setFicha((prev) => {
      const max = Math.max(1, Number(prev.vida.maxima) || 1);
      const atual = Number(prev.vida.atual) || 0;
      const novoAtual = Math.max(-1, Math.min(max, atual + valor));
      return { ...prev, vida: { ...prev.vida, atual: novoAtual } };
    });
  }

  function alterarVidaMaxDireto(valor) {
    const novaMax = Math.max(1, Number(valor) || 1);

    setFicha((prev) => ({
      ...prev,
      vida: {
        maxima: novaMax,
        atual: Math.max(-1, Math.min(novaMax, Number(prev.vida.atual) || 0)),
      },
    }));
  }

  function alterarCA(valor) {
    setFicha((prev) => ({ ...prev, ca: prev.ca + valor }));
  }

  function alterarStatus(tipo, valor) {
    setFicha((prev) => ({
      ...prev,
      status: { ...prev.status, [tipo]: Math.min(4, Math.max(0, prev.status[tipo] + valor)) },
    }));
  }

  function calcularFerimento() {
    if (ficha.vida.atual <= -1) return { texto: "Morto", cor: "#ff2e2e" };
    if (ficha.vida.atual === 0) return { texto: "Desacordado", cor: "#ffd54f" };

    const max = Math.max(1, ficha.vida.maxima);
    const pct = ficha.vida.atual / max;

    if (pct === 1) return { texto: "Normal", cor: "#4caf50" };
    if (pct <= 0.25) return { texto: "Grave", cor: "#ff0000" };
    if (pct <= 0.5) return { texto: "Moderado", cor: "#ff9800" };
    return { texto: "Leve", cor: "#ffb74d" };
  }

  function getIconeFerimento(texto) {
    switch (texto) {
      case "Desacordado":
        return "💫";
      case "Leve":
        return "🩸";
      case "Moderado":
        return "☠️";
      case "Grave":
        return "☠️";
      case "Morto":
        return "☠️";
      default:
        return "";
    }
  }

  /* ===== INVENTÁRIO: FUNÇÕES ===== */

  function alterarQtdEssencial(id, delta) {
    setFicha((prev) => ({
      ...prev,
      inventario: {
        ...prev.inventario,
        essenciais: (prev.inventario?.essenciais || []).map((it) =>
          it.id === id ? { ...it, qtd: Math.max(0, (Number(it.qtd) || 0) + delta) } : it
        ),
      },
    }));
  }

  function adicionarOutro(nome) {
    const n = (nome || "").trim();
    if (!n) return;

    const novo = { id: `${Date.now()}_${Math.random()}`, icon: "📦", nome: n, qtd: 1 };

    setFicha((prev) => ({
      ...prev,
      inventario: { ...prev.inventario, outros: [novo, ...(prev.inventario?.outros || [])] },
    }));
  }

  function alterarQtdOutro(id, delta) {
    setFicha((prev) => ({
      ...prev,
      inventario: {
        ...prev.inventario,
        outros: (prev.inventario?.outros || [])
          .map((it) => (it.id === id ? { ...it, qtd: Math.max(0, (Number(it.qtd) || 0) + delta) } : it))
          .filter((it) => (Number(it.qtd) || 0) > 0),
      },
    }));
  }

  function removerOutro(id) {
    setFicha((prev) => ({
      ...prev,
      inventario: { ...prev.inventario, outros: (prev.inventario?.outros || []).filter((it) => it.id !== id) },
    }));
  }

  function adicionarArmaFogo({ nome, apelido, dano, municao, usos, desc, historia }) {
    const n = (nome || "").trim();
    if (!n) return;

    const nova = {
      id: `${Date.now()}_${Math.random()}`,
      icon: "🔫",
      nome: n,
      apelido: (apelido || "").trim(),
      dano: (dano || "").trim(),
      municao: municao || "Leve",
      usos: Math.max(0, Number(usos) || 0),
      desc: (desc || "").trim(),
      historia: (historia || "").trim(),
    };

    setFicha((prev) => ({
      ...prev,
      inventario: {
        ...prev.inventario,
        armas: { ...prev.inventario.armas, fogo: [nova, ...(prev.inventario?.armas?.fogo || [])] },
      },
    }));
  }

  function adicionarArmaCorpo({ nome, apelido, dano, usos, desc, historia }) {
    const n = (nome || "").trim();
    if (!n) return;

    const nova = {
      id: `${Date.now()}_${Math.random()}`,
      icon: "🗡️",
      nome: n,
      apelido: (apelido || "").trim(),
      dano: (dano || "").trim(),
      usos: Math.max(0, Number(usos) || 0),
      desc: (desc || "").trim(),
      historia: (historia || "").trim(),
    };

    setFicha((prev) => ({
      ...prev,
      inventario: {
        ...prev.inventario,
        armas: { ...prev.inventario.armas, corpo: [nova, ...(prev.inventario?.armas?.corpo || [])] },
      },
    }));
  }

  function alterarUsosArma(tipo, id, delta) {
    setFicha((prev) => ({
      ...prev,
      inventario: {
        ...prev.inventario,
        armas: {
          ...prev.inventario.armas,
          [tipo]: (prev.inventario?.armas?.[tipo] || []).map((it) =>
            it.id === id ? { ...it, usos: Math.max(0, (Number(it.usos) || 0) + delta) } : it
          ),
        },
      },
    }));
  }

  function removerArma(tipo, id) {
    setArmaAberta((cur) => (cur && cur.tipo === tipo && cur.id === id ? null : cur));

    setFicha((prev) => {
      const novasArmasTipo = (prev.inventario?.armas?.[tipo] || []).filter((it) => it.id !== id);

      const armasEq = { ...prev.equipado.armas };
      for (const k of Object.keys(armasEq)) {
        const entry = armasEq[k];
        if (entry && entry.kind === "arma" && entry.tipo === tipo && entry.id === id) armasEq[k] = null;
      }

      return {
        ...prev,
        inventario: { ...prev.inventario, armas: { ...prev.inventario.armas, [tipo]: novasArmasTipo } },
        equipado: { ...prev.equipado, armas: armasEq },
      };
    });
  }

  function encontrarArmaAberta() {
    if (!armaAberta) return null;
    const lista = ficha.inventario?.armas?.[armaAberta.tipo] || [];
    return lista.find((a) => a.id === armaAberta.id) || null;
  }

  /* ===== EQUIPADO: VESTIMENTAS ===== */

  function setVest(slotId, valor) {
    setFicha((prev) => ({
      ...prev,
      equipado: { ...prev.equipado, vestimentas: { ...prev.equipado.vestimentas, [slotId]: valor } },
    }));
  }

  /* ===== EQUIPADO: ARMAS ===== */

  function abrirEquipPicker(slotId, tipo) {
    setEquipPicker({ open: true, slotId, tipo });
  }

  function fecharEquipPicker() {
    setEquipPicker({ open: false, slotId: null, tipo: "fogo" });
  }

  function equiparArma(slotId, tipo, armaId) {
    setFicha((prev) => ({
      ...prev,
      equipado: {
        ...prev.equipado,
        armas: { ...prev.equipado.armas, [slotId]: armaId ? { kind: "arma", tipo, id: armaId } : null },
      },
    }));
  }

  function desequiparSlot(slotId) {
    setFicha((prev) => ({
      ...prev,
      equipado: { ...prev.equipado, armas: { ...prev.equipado.armas, [slotId]: null } },
    }));
  }

  function slotsQueContemArma(tipo, id) {
    const armasEq = ficha.equipado?.armas || {};
    const slots = [];
    for (const k of Object.keys(armasEq)) {
      const entry = armasEq[k];
      if (entry && entry.kind === "arma" && entry.tipo === tipo && entry.id === id) slots.push(k);
    }
    return slots;
  }

  function desequiparArmaPorId(tipo, id) {
    setFicha((prev) => {
      const armasEq = { ...prev.equipado.armas };
      let mudou = false;

      for (const k of Object.keys(armasEq)) {
        const entry = armasEq[k];
        if (entry && entry.kind === "arma" && entry.tipo === tipo && entry.id === id) {
          armasEq[k] = null;
          mudou = true;
        }
      }

      if (!mudou) return prev;
      return { ...prev, equipado: { ...prev.equipado, armas: armasEq } };
    });
  }

  function resolverArma(slotId) {
    const entry = ficha.equipado?.armas?.[slotId];
    if (!entry || entry.kind !== "arma") return null;

    const lista = ficha.inventario?.armas?.[entry.tipo] || [];
    const arma = lista.find((a) => a.id === entry.id);
    if (!arma) return null;

    return { ...arma, tipo: entry.tipo };
  }

  function nomeSlot(slotId) {
    const map = { maoPrimaria: "Mão Primária", maoSecundaria: "Mão Secundária", corpoACorpo: "Corpo a Corpo" };
    return map[slotId] || slotId;
  }

  /* ===== NOTAS: FUNÇÕES ===== */

  function adicionarNota({ cat, titulo, texto, tags }) {
    const now = new Date().toISOString();
    const nota = {
      id: `${Date.now()}_${Math.random()}`,
      cat: String(cat || "geral"),
      titulo: String(titulo || "").trim(),
      texto: String(texto || "").trim(),
      tags: Array.isArray(tags) ? tags : [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setFicha((prev) => ({
      ...prev,
      notas: {
        ...prev.notas,
        itens: [nota, ...(prev.notas?.itens || [])],
      },
    }));
  }

  function editarNota(id, patch) {
    setFicha((prev) => {
      const itens = prev.notas?.itens || [];
      const now = new Date().toISOString();

      const next = itens.map((n) => {
        if (n.id !== id) return n;

        const novo = {
          ...n,
          ...patch,
          titulo: patch?.titulo !== undefined ? String(patch.titulo) : n.titulo,
          texto: patch?.texto !== undefined ? String(patch.texto) : n.texto,
          cat: patch?.cat !== undefined ? String(patch.cat) : n.cat,
          tags: patch?.tags !== undefined ? (Array.isArray(patch.tags) ? patch.tags : []) : n.tags,
          updatedAt: now,
        };

        novo.tags = (novo.tags || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 12);
        return novo;
      });

      return { ...prev, notas: { ...prev.notas, itens: next } };
    });
  }

  function removerNota(id) {
    setFicha((prev) => ({
      ...prev,
      notas: { ...prev.notas, itens: (prev.notas?.itens || []).filter((n) => n.id !== id) },
    }));
  }

  function togglePinNota(id) {
    setFicha((prev) => {
      const now = new Date().toISOString();
      const next = (prev.notas?.itens || []).map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: now } : n));
      return { ...prev, notas: { ...prev.notas, itens: next } };
    });
  }

  // ===== MODAL CONFIRMAÇÃO (sem confirm()) =====
  function abrirConfirmRemoverNota(notaId) {
    setConfirmModal({ open: true, notaId });
  }

  function fecharConfirmRemoverNota() {
    setConfirmModal({ open: false, notaId: null });
  }

  function confirmarRemoverNota() {
    const id = confirmModal.notaId;
    if (!id) return fecharConfirmRemoverNota();
    removerNota(id);
    fecharConfirmRemoverNota();
  }

  // ===== EXPORT / IMPORT =====
  async function exportarFicha() {
    try {
      const json = JSON.stringify(ficha);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(json);
        alert("Ficha exportada! (JSON copiado para a área de transferência)");
      } else {
        // fallback: cria seleção em textarea temporário
        const ta = document.createElement("textarea");
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        alert("Ficha exportada! (JSON copiado)");
      }
    } catch {
      alert("Não foi possível exportar. Tente novamente.");
    }
  }

  function abrirImportarFicha() {
    setImportModalOpen(true);
  }

  function fecharImportarFicha() {
    setImportModalOpen(false);
  }

  function importarFichaDoTexto(texto) {
    const raw = (texto || "").trim();
    if (!raw) {
      alert("Cole o JSON antes de importar.");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const merged = mergeComPadrao(parsed);
      setFicha(merged);
      setImportModalOpen(false);
      alert("Importado com sucesso!");
    } catch {
      alert("JSON inválido. Confira se você copiou a ficha completa.");
    }
  }

  function irParaEquipado() {
    setAbaAtiva("equipado");
  }

  const ferimento = calcularFerimento();

  const essenciaisPorCat = useMemo(() => {
  const essenciais = ficha.inventario?.essenciais || [];
  const map = new Map();
  for (const cat of CATS_ESSENCIAIS) map.set(cat.id, []);
  for (const it of essenciais) {
    if (!map.has(it.cat)) map.set(it.cat, []);
    map.get(it.cat).push(it);
  }
  return map;
}, [ficha.inventario?.essenciais]);

  const estaMorto = ficha.vida.atual <= -1;

  return (
    <div style={styles.app}>
      <style>{`
        .eqWeaponsGrid{
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 520px){
          .eqWeaponsGrid{
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 380px){
          .eqWeaponActions{
            flex-direction: column;
          }
        }
      `}</style>

      {estaMorto ? <TelaMorte onReanimar={() => alterarVida(1)} /> : null}

      {/* ABAS */}
      <nav style={styles.tabsBar}>
        <button style={{ ...styles.tabBtn, ...(abaAtiva === "status" ? styles.tabBtnAtiva : null) }} onClick={() => setAbaAtiva("status")}>
          Status
        </button>
        <button style={{ ...styles.tabBtn, ...(abaAtiva === "inventario" ? styles.tabBtnAtiva : null) }} onClick={() => setAbaAtiva("inventario")}>
          Inventário
        </button>
        <button style={{ ...styles.tabBtn, ...(abaAtiva === "equipado" ? styles.tabBtnAtiva : null) }} onClick={() => setAbaAtiva("equipado")}>
          Equipado
        </button>
        <button style={{ ...styles.tabBtn, ...(abaAtiva === "notas" ? styles.tabBtnAtiva : null) }} onClick={() => setAbaAtiva("notas")}>
          Notas
        </button>
      </nav>

      {/* ABA STATUS */}
      {abaAtiva === "status" && (
        <>
          <header style={styles.hudContainer}>
            <div style={styles.hudTopo}>
              <div style={styles.blocoVida}>
                <div style={styles.coracaoBox}>
                  <div style={styles.coracaoFrame}>
                    <div style={{...styles.vidaImgGrande, fontSize: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>❤️</div>

                    <div style={styles.vidaOverlay}>
                      <span style={styles.vidaAtualTopo}>{ficha.vida.atual}</span>
                      <div style={styles.vidaDivisor}></div>

                      {editandoVidaMax ? (
                        <input
                          type="number"
                          value={ficha.vida.maxima}
                          onChange={(e) => alterarVidaMaxDireto(e.target.value)}
                          onBlur={() => setEditandoVidaMax(false)}
                          autoFocus
                          style={styles.inputVidaMaxBaixo}
                        />
                      ) : (
                        <span style={styles.vidaMaxBaixo} onClick={() => setEditandoVidaMax(true)}>
                          {ficha.vida.maxima}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={styles.botoesVida}>
                    <button style={styles.botaoHUD} onClick={() => alterarVida(-1)}>
                      −
                    </button>
                    <button style={styles.botaoHUD} onClick={() => alterarVida(1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.blocoCA}>
                <div style={styles.caWrapper}>
                  <div style={{...styles.escudoImg, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
                  <div style={styles.caValor}>{ficha.ca}</div>
                </div>

                <div style={styles.caBotoes}>
                  <button style={styles.botaoHUD} onClick={() => alterarCA(-1)}>
                    −
                  </button>
                  <button style={styles.botaoHUD} onClick={() => alterarCA(1)}>
                    +
                  </button>
                </div>
              </div>
            </div>

            {ferimento.texto !== "Normal" && (
              <div style={styles.ferimentoRow}>
                <div style={styles.ferimentoBox}>
                  <span style={styles.ferimentoIcon}>{getIconeFerimento(ferimento.texto)}</span>
                  <span style={{ ...styles.ferimentoTexto, color: ferimento.cor }}>
                    {ferimento.texto === "Desacordado" ? "DESACORDADO" : `FERIMENTO ${ferimento.texto.toUpperCase()}`}
                  </span>
                </div>
              </div>
            )}
          </header>

          <main style={styles.painel}>
            <CardStatus nome="🍖 Fome" tipo="fome" valor={ficha.status.fome} alterarStatus={alterarStatus} />
            <CardStatus nome="💧 Sede" tipo="sede" valor={ficha.status.sede} alterarStatus={alterarStatus} />
            <CardStatus nome="🧠 Sanidade" tipo="sanidade" valor={ficha.status.sanidade} alterarStatus={alterarStatus} />
            <CardStatus nome="💤 Exaustão" tipo="exaustao" valor={ficha.status.exaustao} alterarStatus={alterarStatus} />
          </main>
        </>
      )}

      {/* ABA INVENTÁRIO */}
      {abaAtiva === "inventario" && (
        <main style={styles.painel}>
          <div style={styles.invTitulo}>Inventário</div>

          {CATS_ESSENCIAIS.map((cat) => {
            const itensCat = essenciaisPorCat.get(cat.id) || [];
            return (
              <details key={cat.id} style={styles.invCategoria}>
                <summary style={styles.invSummary}>
                  <span style={styles.invSummaryLeft}>
                    <span style={styles.invCatIcon}>{cat.icon}</span>
                    <span style={styles.invCatTitulo}>{cat.titulo}</span>
                  </span>
                  <span style={styles.invCount}>{itensCat.length}</span>
                </summary>

                <div style={styles.invLista}>
                  {itensCat.map((it) => (
                    <div key={it.id} style={styles.invLinhaItem}>
                      <div style={styles.invItemLeft}>
                        <span style={styles.invItemIcon}>{it.icon}</span>
                        <span style={styles.invItemNome}>{it.nome}</span>
                      </div>

                      <div style={styles.invItemRight}>
                        <button style={styles.invBtn} onClick={() => alterarQtdEssencial(it.id, -1)}>
                          −
                        </button>
                        <span style={styles.invQtd}>{it.qtd}</span>
                        <button style={styles.invBtn} onClick={() => alterarQtdEssencial(it.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}

          <details style={styles.invCategoria}>
            <summary style={styles.invSummary}>
              <span style={styles.invSummaryLeft}>
                <span style={styles.invCatIcon}>⚔️</span>
                <span style={styles.invCatTitulo}>Armas</span>
              </span>
              <span style={styles.invCount}>
                {(ficha.inventario?.armas?.fogo || []).length + (ficha.inventario?.armas?.corpo || []).length}
              </span>
            </summary>

            <details style={styles.subCategoria}>
              <summary style={styles.subSummary}>
                <span style={styles.invSummaryLeft}>
                  <span style={styles.invCatIcon}>🔫</span>
                  <span style={styles.invCatTitulo}>Armas de Fogo</span>
                </span>
                <span style={styles.invCount}>{(ficha.inventario?.armas?.fogo || []).length}</span>
              </summary>
              <ArmasFogo ficha={ficha} setArmaAberta={setArmaAberta} adicionarArmaFogo={adicionarArmaFogo} />
            </details>

            <details style={styles.subCategoria}>
              <summary style={styles.subSummary}>
                <span style={styles.invSummaryLeft}>
                  <span style={styles.invCatIcon}>🗡️</span>
                  <span style={styles.invCatTitulo}>Corpo a Corpo</span>
                </span>
                <span style={styles.invCount}>{(ficha.inventario?.armas?.corpo || []).length}</span>
              </summary>
              <ArmasCorpo ficha={ficha} setArmaAberta={setArmaAberta} adicionarArmaCorpo={adicionarArmaCorpo} />
            </details>
          </details>

          <details style={styles.invCategoria}>
            <summary style={styles.invSummary}>
              <span style={styles.invSummaryLeft}>
                <span style={styles.invCatIcon}>📦</span>
                <span style={styles.invCatTitulo}>Outros</span>
              </span>
              <span style={styles.invCount}>{(ficha.inventario?.outros || []).length}</span>
            </summary>

            <InventarioOutros ficha={ficha} adicionarOutro={adicionarOutro} alterarQtdOutro={alterarQtdOutro} removerOutro={removerOutro} />
          </details>
        </main>
      )}

      {/* ABA EQUIPADO */}
      {abaAtiva === "equipado" && (
        <EquipadoTela
          ficha={ficha}
          setVest={setVest}
          abrirEquipPicker={abrirEquipPicker}
          resolverArma={resolverArma}
          desequiparSlot={desequiparSlot}
          setArmaAberta={setArmaAberta}
        />
      )}

      {/* ABA NOTAS */}
      {abaAtiva === "notas" && (
        <NotasTela
          ficha={ficha}
          adicionarNota={adicionarNota}
          editarNota={editarNota}
          removerNota={removerNota}
          togglePinNota={togglePinNota}
          setAbaAtiva={setAbaAtiva}
          abrirConfirmRemoverNota={abrirConfirmRemoverNota}
          exportarFicha={exportarFicha}
          abrirImportarFicha={abrirImportarFicha}
        />
      )}

      {/* MODAIS */}
      <ModalArmaDetalhe
        armaAberta={armaAberta}
        setArmaAberta={setArmaAberta}
        encontrarArmaAberta={encontrarArmaAberta}
        alterarUsosArma={alterarUsosArma}
        removerArma={removerArma}
        slotsQueContemArma={slotsQueContemArma}
        nomeSlot={nomeSlot}
        desequiparArmaPorId={desequiparArmaPorId}
        irParaEquipado={irParaEquipado}
      />

      <ModalEquipPicker equipPicker={equipPicker} fecharEquipPicker={fecharEquipPicker} ficha={ficha} equiparArma={equiparArma} desequiparSlot={desequiparSlot} />

      <ModalConfirmar
        open={confirmModal.open}
        titulo="Remover nota"
        texto="Tem certeza que deseja remover esta nota? Essa ação não pode ser desfeita."
        onCancel={fecharConfirmRemoverNota}
        onConfirm={confirmarRemoverNota}
      />

      <ModalImportarFicha open={importModalOpen} onClose={fecharImportarFicha} onImport={importarFichaDoTexto} />
    </div>
  );
}

/* ===== ESTILOS ===== */
const styles = {
  app: {
    background: "#121212",
    color: "#fff",
    padding: 8,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  tabsBar: {
    display: "flex",
    gap: 8,
    padding: "8px 12px",
    background: "rgba(0,0,0,0.35)",
    borderRadius: 12,
    marginBottom: 10,
  },

  tabBtn: { flex: 1, height: 40, fontSize: 14, fontWeight: "bold", borderRadius: 10, border: "none" },
  tabBtnAtiva: { outline: "2px solid rgba(255,255,255,0.25)" },

  painel: { flex: 1, overflowY: "auto", paddingBottom: 12 },

  hudContainer: { display: "flex", flexDirection: "column", gap: 12 },
  hudTopo: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0 12px" },

  blocoVida: { width: 180, display: "flex", flexDirection: "column", alignItems: "center", marginTop: -10 },
  coracaoBox: { width: 190, display: "flex", flexDirection: "column", alignItems: "center" },
  coracaoFrame: { position: "relative", width: 220, height: 200, overflow: "hidden" },
  vidaImgGrande: { width: 220, display: "block", transform: "translateY(-28px)" },

  vidaOverlay: { position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" },
  vidaAtualTopo: { fontSize: 38, fontWeight: "bold", color: "#ff2e2e", lineHeight: 1 },
  vidaDivisor: { width: 36, height: 2, backgroundColor: "#000", margin: "1px 0" },
  vidaMaxBaixo: { fontSize: 30, fontWeight: "bold", color: "#000", cursor: "pointer", lineHeight: 1 },
  inputVidaMaxBaixo: { width: 44, fontSize: 18, fontWeight: "bold", textAlign: "center", borderRadius: 6, border: "none", outline: "none" },
  botoesVida: { display: "flex", gap: 10, justifyContent: "center", marginTop: 2 },

  ferimentoRow: { width: "100%", display: "flex", justifyContent: "center" },
  ferimentoBox: { padding: "6px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 18, background: "rgba(0,0,0,0.6)" },
  ferimentoTexto: { fontSize: 16, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase" },
  ferimentoIcon: { fontSize: 18, lineHeight: 1 },

  caWrapper: { position: "relative", display: "flex", justifyContent: "center", alignItems: "center" },
  escudoImg: { width: 100 },
  caValor: { position: "absolute", fontSize: 40, fontWeight: "bold", color: "#010102ed", textShadow: "0 0 6px rgba(0,0,0,0.8)", top: "45%", left: "50%", transform: "translate(-50%, -50%)" },
  caBotoes: { display: "flex", gap: 10, justifyContent: "center", marginTop: 6 },
  blocoCA: { width: 120, display: "flex", flexDirection: "column", alignItems: "center" },

  botaoHUD: { width: 36, height: 36, fontSize: 23, borderRadius: 6, border: "none", background: "#e0e0e0" },

  statusCard: { background: "#1a1a1a", borderRadius: 12, padding: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 8 },
  statusHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  statusTitulo: { fontSize: 16, fontWeight: "bold" },
  statusPips: { display: "flex", gap: 4, alignItems: "center" },
  statusPip: { width: 10, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.15)" },
  statusPipAtivo: { background: "rgba(255, 82, 82, 0.9)" },
  statusPipAtivoOk: { background: "rgba(76, 175, 80, 0.9)" },
  statusMensagemNova: { fontSize: 15, lineHeight: 1.3, padding: "8px 10px", borderRadius: 10, background: "rgba(0,0,0,0.35)", color: "#ff5252", textAlign: "center" },
  statusFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  statusBtn: { width: 40, height: 40, fontSize: 24, borderRadius: 10, border: "none" },
  statusNivel: { minWidth: 54, textAlign: "center", fontSize: 14, fontWeight: "bold", letterSpacing: 1 },

  invTitulo: { fontSize: 18, fontWeight: "bold", margin: "4px 4px 10px" },
  invCategoria: { background: "#1a1a1a", borderRadius: 12, padding: 10, marginTop: 10 },
  subCategoria: { marginTop: 10, background: "rgba(0,0,0,0.18)", borderRadius: 12, padding: 10 },

  invSummary: { listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  subSummary: { listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  invSummaryLeft: { display: "flex", alignItems: "center", gap: 8 },

  invCatIcon: { fontSize: 18 },
  invCatTitulo: { fontSize: 16, fontWeight: "bold" },
  invCount: { fontSize: 12, opacity: 0.85, padding: "2px 8px", borderRadius: 999, background: "rgba(0,0,0,0.35)" },

  invLista: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 },
  invLinhaItem: { background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 10, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },

  invItemLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  invItemIcon: { fontSize: 18 },
  invItemNome: { fontSize: 14, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 },
  invItemRight: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },

  invBtn: { width: 32, height: 32, borderRadius: 10, border: "none", fontSize: 20, fontWeight: "bold" },
  invQtd: { minWidth: 18, textAlign: "center", fontWeight: "bold" },
  invRemover: { width: 32, height: 32, borderRadius: 10, border: "none", fontSize: 16, fontWeight: "bold" },

  invVazio: { opacity: 0.8, textAlign: "center", padding: 12 },
  invBox: { marginTop: 10 },
  invFormRow: { display: "flex", gap: 8, marginTop: 10 },
  invInput: { flex: 1, height: 36, borderRadius: 10, border: "none", padding: "0 10px", outline: "none" },
  invAdd: { width: 96, height: 36, borderRadius: 10, border: "none", fontWeight: "bold" },
  invAddWide: { width: "100%", height: 36, borderRadius: 10, border: "none", fontWeight: "bold" },

  armaForm: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 },
  armaFormRow: { display: "flex", gap: 8 },

  danoInput: { flex: 1, height: 36, borderRadius: 10, border: "none", padding: "0 10px", outline: "none" },
  municaoSelect: { width: 150, height: 36, borderRadius: 10, border: "none", padding: "0 10px", outline: "none" },
  usosInput: { width: 90, height: 36, borderRadius: 10, border: "none", padding: "0 10px", outline: "none" },

  descInput: { width: "100%", borderRadius: 10, border: "none", padding: 10, outline: "none", resize: "vertical" },

  armaHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 6 },
  armaHeaderTitle: { display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", fontSize: 15, opacity: 0.95 },

  armaToggleBtn: { height: 34, padding: "0 12px", borderRadius: 999, border: "none", fontWeight: "bold", background: "rgba(255,255,255,0.14)", color: "#fff" },

  armaCardBtnDestaque: { background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: 14, textAlign: "left", width: "100%", boxShadow: "0 10px 24px rgba(0,0,0,0.35)", color: "#fff" },

  armaCardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  armaNomeBox: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexWrap: "wrap" },
  armaIconGrande: { fontSize: 22, lineHeight: 1 },
  armaNomeStack: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  armaNomeGrande: { fontSize: 18, fontWeight: 800, letterSpacing: 0.2, color: "rgba(255,255,255,0.96)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 },
  apelidoLinha: { fontSize: 13, opacity: 0.92, color: "rgba(255,255,255,0.82)" },
  armaChevron: { fontSize: 22, opacity: 0.7, fontWeight: "bold" },

  armaBadgesLinha: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  badgeStrong: { fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)", whiteSpace: "nowrap" },

  armaDescClamp: { fontSize: 14, opacity: 0.92, color: "rgba(255,255,255,0.88)", lineHeight: 1.35, marginTop: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },

  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", justifyContent: "center", alignItems: "flex-end", padding: 12, zIndex: 999 },
  modalSheet: { width: "100%", maxWidth: 520, background: "#141414", borderRadius: 18, padding: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" },
  modalTopBar: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", gap: 8, marginBottom: 10 },
  modalClose: { height: 36, borderRadius: 10, border: "none", fontWeight: "bold", justifySelf: "start" },
  modalTitle: { textAlign: "center", fontWeight: "bold", opacity: 0.95 },
  modalEquip: { height: 36, borderRadius: 10, border: "none", fontWeight: "bold", justifySelf: "end" },

  modalHero: { background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 10 },
  modalNomeLinha: { display: "flex", gap: 10, alignItems: "center" },
  modalIcon: { fontSize: 26, lineHeight: 1 },
  modalNomeBox: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  modalNome: { fontSize: 18, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 },
  modalApelido: { fontSize: 13, opacity: 0.9 },

  modalBadges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badgeBig: { fontSize: 12, fontWeight: "bold", padding: "4px 10px", borderRadius: 999, background: "rgba(0,0,0,0.35)", whiteSpace: "nowrap" },

  modalUsosRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 2 },
  modalUsosBtn: { width: 44, height: 44, fontSize: 26, borderRadius: 12, border: "none", fontWeight: "bold" },
  modalUsosTxt: { fontWeight: "bold", opacity: 0.9 },

  modalSection: { marginTop: 12, background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: 12 },
  modalSectionTitle: { fontWeight: "bold", marginBottom: 6, opacity: 0.9 },
  modalText: { fontSize: 14, lineHeight: 1.35, whiteSpace: "pre-wrap", opacity: 0.95 },
  modalBottom: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  modalRemove: { height: 40, borderRadius: 12, border: "none", fontWeight: "bold", padding: "0 12px" },

  importTextarea: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: 12,
    outline: "none",
    resize: "vertical",
    fontSize: 13,
    lineHeight: 1.35,
  },
  importHint: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.80)", lineHeight: 1.3 },

  eqPanel: { background: "#1a1a1a", borderRadius: 16, padding: 12, marginTop: 10, border: "1px solid rgba(255,255,255,0.10)", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat" },
  eqPanelHeader: { marginBottom: 10 },
  eqPanelTitle: { fontSize: 16, fontWeight: 900, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.9)" },
  eqPanelSub: { marginTop: 4, fontSize: 13, color: "rgba(255,255,255,0.92)", textShadow: "0 2px 10px rgba(0,0,0,0.9)", lineHeight: 1.35 },

  eqFields: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
  eqFieldRow: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 14, padding: 10, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 10px 26px rgba(0,0,0,0.35)" },

  eqFieldLeft: { display: "flex", alignItems: "center", gap: 10 },
  eqFieldIconBox: { width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.18)", flexShrink: 0 },
  eqFieldIcon: { fontSize: 20, lineHeight: 1 },

  eqFieldLabelBox: { minWidth: 0 },
  eqFieldLabel: { fontSize: 16, fontWeight: 950, color: "#ffe86a", textShadow: "0 2px 10px rgba(0,0,0,0.95)" },
  eqFieldHint: { marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.90)", textShadow: "0 2px 10px rgba(0,0,0,0.95)", lineHeight: 1.25 },

  eqFieldInput: { width: "100%", borderRadius: 12, border: "1px solid rgba(255,232,106,0.42)", background: "rgba(0,0,0,0.55)", color: "#ffffff", padding: 12, outline: "none", resize: "vertical", fontSize: 15, lineHeight: 1.4, boxShadow: "0 10px 22px rgba(0,0,0,0.35)" },

  eqWeaponsGrid: { gap: 10, marginTop: 10 },

  eqWeaponCard: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 14, padding: 12, textAlign: "left", width: "100%", color: "#fff", boxShadow: "0 10px 26px rgba(0,0,0,0.35)" },

  eqWeaponTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  eqWeaponLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },

  eqWeaponIconBox: { width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.18)", flexShrink: 0 },
  eqWeaponIcon: { fontSize: 18, lineHeight: 1 },

  eqWeaponText: { minWidth: 0 },
  eqWeaponTitle: { fontSize: 13, fontWeight: 950, color: "#ffe86a", textShadow: "0 2px 10px rgba(0,0,0,0.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 },
  eqWeaponName: { marginTop: 4, fontSize: 14, fontWeight: 900, color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 },

  eqWeaponBadges: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  eqEmptyHint: { marginTop: 10, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.88)", textShadow: "0 2px 10px rgba(0,0,0,0.95)" },

  eqWeaponActions: { display: "flex", gap: 8, marginTop: 12 },
  eqActionPrimary: { flex: 1, height: 36, borderRadius: 12, border: "1px solid rgba(255,232,106,0.55)", fontWeight: 950, background: "rgba(255,232,106,0.18)", color: "#ffe86a", textShadow: "0 2px 10px rgba(0,0,0,0.85)" },
  eqActionGhost: { flex: 1, height: 36, borderRadius: 12, border: "1px solid rgba(255,255,255,0.18)", fontWeight: 900, background: "rgba(0,0,0,0.38)", color: "rgba(255,255,255,0.95)", textShadow: "0 2px 10px rgba(0,0,0,0.85)" },

  eqBadge: { width: "100%", padding: "8px 10px", borderRadius: 12, background: "rgba(255,232,106,0.10)", border: "1px solid rgba(255,232,106,0.22)", color: "rgba(255,255,255,0.92)", fontWeight: 850 },
  eqBadgeStrong: { color: "#ffe86a", fontWeight: 950 },

  notesPanel: {
    background: "#1a1a1a",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    border: "1px solid rgba(255,255,255,0.10)",
  },

  notesHeaderRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  notesHeaderActions: { display: "flex", gap: 8, alignItems: "center" },

  notesHeader: { marginBottom: 10 },
  notesTitle: { fontSize: 16, fontWeight: 950, color: "#fff" },
  notesSub: { marginTop: 4, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.3 },

  notesHeaderBtn: {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.45)",
    background: "rgba(255,232,106,0.14)",
    color: "#ffe86a",
    fontWeight: 950,
  },
  notesHeaderBtnGhost: {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 900,
  },

  notesTemplatesRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  notesTemplateBtn: {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.45)",
    background: "rgba(255,232,106,0.14)",
    color: "#ffe86a",
    fontWeight: 950,
  },
  notesTemplateBtnGhost: {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 900,
  },

  notesForm: { marginTop: 12, display: "flex", flexDirection: "column", gap: 10 },
  notesFormRow: { display: "flex", gap: 8, alignItems: "center" },

  notesSelect: {
    width: 140,
    height: 36,
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.30)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 10px",
    outline: "none",
    fontWeight: 900,
  },
  notesSelectSmall: {
    width: 130,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 10px",
    outline: "none",
    fontWeight: 900,
  },
  notesInput: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.30)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 10px",
    outline: "none",
    fontWeight: 800,
  },
  notesTextarea: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.30)",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    padding: 12,
    outline: "none",
    resize: "vertical",
    fontSize: 14,
    lineHeight: 1.4,
  },
  notesSaveBtn: {
    width: 110,
    height: 36,
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.55)",
    background: "rgba(255,232,106,0.18)",
    color: "#ffe86a",
    fontWeight: 950,
  },
  notesHint: { fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.3 },

  notesListTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  notesFilters: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  notesSearch: {
    width: 220,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "0 10px",
    outline: "none",
    fontWeight: 800,
  },

  notesList: { marginTop: 10, display: "flex", flexDirection: "column", gap: 10 },

  noteCard: { background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden" },
  noteSummary: {
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    cursor: "pointer",
    padding: 10,
  },
  noteSummaryLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  noteCatIcon: { fontSize: 20, flexShrink: 0 },
  noteSummaryText: { minWidth: 0 },
  noteTitleRow: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  noteTitleText: { fontWeight: 950, color: "#ffe86a", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: 260 },
  notePinned: { fontSize: 14, opacity: 0.95 },

  noteMetaRow: { marginTop: 4, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  noteMetaChip: { fontSize: 12, fontWeight: 900, padding: "4px 10px", borderRadius: 999, background: "rgba(255,232,106,0.12)", border: "1px solid rgba(255,232,106,0.18)", color: "rgba(255,255,255,0.92)" },
  noteMetaDim: { fontSize: 12, color: "rgba(255,255,255,0.70)" },

  noteSummaryRight: { display: "flex", gap: 8, alignItems: "center" },
  noteMiniBtn: {
    height: 32,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 900,
  },

  noteBody: { padding: 10, borderTop: "1px solid rgba(255,255,255,0.10)" },
  noteTagsRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, alignItems: "center" },
  noteTag: { fontSize: 12, fontWeight: 900, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" },

  noteEditArea: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,232,106,0.24)",
    background: "rgba(0,0,0,0.40)",
    color: "#fff",
    padding: 12,
    outline: "none",
    resize: "vertical",
    fontSize: 14,
    lineHeight: 1.4,
  },
  noteEditRow: { display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" },
  noteEditTitle: {
    flex: 1,
    minWidth: 220,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.30)",
    color: "#fff",
    padding: "0 10px",
    outline: "none",
    fontWeight: 850,
  },
  noteRemoveBtn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,46,46,0.35)",
    background: "rgba(255,46,46,0.12)",
    color: "#ff9a9a",
    fontWeight: 950,
  },

  deathScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "linear-gradient(rgba(0,0,0,0.92), rgba(0,0,0,0.96))",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  deathCard: {
    width: "100%",
    maxWidth: 520,
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(255,46,46,0.35)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 16px 50px rgba(0,0,0,0.75)",
    textAlign: "center",
  },
  deathSkull: { fontSize: 46, lineHeight: 1 },
  deathTitle: { marginTop: 10, fontSize: 28, fontWeight: 950, letterSpacing: 2, color: "#ff2e2e", textShadow: "0 0 18px rgba(255,46,46,0.35)" },
  deathText: { marginTop: 10, fontSize: 14, lineHeight: 1.45, color: "rgba(255,255,255,0.88)" },
  deathBtn: { marginTop: 14, width: "100%", height: 42, borderRadius: 14, border: "1px solid rgba(255,46,46,0.45)", background: "rgba(255,46,46,0.16)", color: "#ff9a9a", fontWeight: 950 },
};
