type Limitation = {
  id: string
  title: string
  body: string
}

const MISSING_FROM_SOURCE: Limitation[] = [
  {
    id: "caseLawCitation",
    title: "Citação de acórdão",
    body: "O DataJud publica a capa do processo e as movimentações, não o texto da decisão. Sem o inteiro teor não há trecho de acórdão para citar, e os repositórios de jurisprudência dos tribunais do escopo não oferecem uma forma aberta de coletar esse texto.",
  },
  {
    id: "citedDecisions",
    title: "Decisões citadas",
    body: "A lista de decisões que sustentam o texto depende do mesmo inteiro teor. Enquanto ele não puder ser coletado, o Ratio não indica decisões como citadas.",
  },
  {
    id: "amountAwarded",
    title: "Valor fixado",
    body: "O valor da condenação não é um campo estruturado no DataJud. Ele só aparece no texto da decisão, quando aparece, e por isso nenhuma mediana ou faixa de valor é exibida.",
  },
  {
    id: "reporterJudge",
    title: "Relator",
    body: "O nome do relator não vem de forma estruturada e consistente entre os tribunais, então ele não é exibido nem usado em nenhuma conta.",
  },
]

const SITUATIONS: Limitation[] = [
  {
    id: "notLoaded",
    title: "Dado ainda não carregado",
    body: "O dado existe na fonte, mas a carga que o produz ainda não rodou nesta base. Ele aparece depois da próxima carga, sem nenhuma ação sua.",
  },
  {
    id: "notApplicable",
    title: "Não se aplica a este tema",
    body: "O bloco não faz sentido para o tema. Um tema sem decisões julgadas, por exemplo, não tem entendimento para descrever.",
  },
]

const ABOUT_THE_DATA: Limitation[] = [
  {
    id: "scope",
    title: "Escopo",
    body: "Os dados cobrem a matéria cível do TJSP, TJRJ e TJMG. Um percentual no Ratio vale para esses três tribunais e não deve ser lido como tendência nacional.",
  },
  {
    id: "updates",
    title: "Atualização",
    body: "Os dados não são em tempo real. Cada tela mostra no rodapé a fonte e a data de extração do que está exibido, e é essa data que deve acompanhar uma citação.",
  },
]

function LimitationSection({ limitation }: { limitation: Limitation }) {
  return (
    <section
      id={limitation.id}
      aria-labelledby={`${limitation.id}-title`}
      className="flex scroll-mt-8 flex-col gap-2"
    >
      <h2
        id={`${limitation.id}-title`}
        className="font-sans text-xl font-bold text-foreground"
      >
        {limitation.title}
      </h2>
      <p className="font-sans text-[17px] leading-[1.75] text-foreground">
        {limitation.body}
      </p>
    </section>
  )
}

function LimitationGroup({
  title,
  limitations,
}: {
  title: string
  limitations: Limitation[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </p>
      {limitations.map((limitation) => (
        <LimitationSection key={limitation.id} limitation={limitation} />
      ))}
    </div>
  )
}

export function LimitationsPage() {
  return (
    <div className="flex max-w-[690px] flex-col gap-12">
      <header className="flex flex-col gap-4 border-b border-[#DCD6C9] pb-10">
        <h1 className="font-sans text-[34px] leading-tight font-bold text-foreground">
          Limitações dos dados
        </h1>
        <p className="font-sans text-[17px] leading-[1.75] text-foreground">
          O Ratio lê os metadados públicos dos processos pelo DataJud, a base do
          CNJ. Alguns dados que você esperaria ver não existem nessa fonte.
          Quando um deles falta, a tela diz o motivo em vez de mostrar um valor
          inventado, e esta página explica cada caso.
        </p>
      </header>
      <LimitationGroup
        title="O que a fonte não fornece"
        limitations={MISSING_FROM_SOURCE}
      />
      <LimitationGroup title="Outros motivos" limitations={SITUATIONS} />
      <LimitationGroup title="Sobre os dados" limitations={ABOUT_THE_DATA} />
    </div>
  )
}
