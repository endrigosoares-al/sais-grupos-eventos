import {
  Document, Page, Text, View, StyleSheet, Image, Font
} from "@react-pdf/renderer"
import type { Quotation } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { HOTEL } from "@/lib/constants"

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
})

const GOLD = "#C1A15C"
const INK = "#1A1A1A"
const LIGHT = "#6B6B6B"
const BEIGE = "#E9E5C3"
const BORDER = "#E2DDC8"
const WHITE = "#FFFFFF"
const DARK = "#1A1A1A"

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: INK,
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 0,
  },
  // Header
  header: {
    backgroundColor: WHITE,
    paddingHorizontal: 48,
    paddingTop: 36,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  logoText: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 6,
  },
  logoSub: {
    fontSize: 7,
    letterSpacing: 5,
    color: LIGHT,
    marginTop: 2,
  },
  dateBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dateText: { fontSize: 8, color: LIGHT },
  proposalNum: { fontSize: 8, color: GOLD, fontFamily: "Helvetica-Bold" },
  // Intro
  intro: {
    paddingHorizontal: 48,
    paddingVertical: 20,
    backgroundColor: BEIGE,
  },
  introTo: { fontSize: 9, color: LIGHT },
  introName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK, marginTop: 2 },
  introBody: { fontSize: 8.5, color: LIGHT, marginTop: 10, lineHeight: 1.6 },
  // Content
  content: { paddingHorizontal: 48 },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  row2: { flexDirection: "row", gap: 8, marginBottom: 5 },
  label: { fontSize: 8, color: LIGHT, width: 110 },
  value: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK, flex: 1 },
  // Allotment bullets
  bullet: { flexDirection: "row", gap: 6, marginBottom: 4 },
  bulletDot: { fontSize: 9, color: GOLD },
  bulletText: { fontSize: 8.5, color: INK, flex: 1 },
  // Finance box
  financeBox: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 6,
  },
  financeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  financeLabel: { fontSize: 8, color: "#AAAAAA" },
  financeValue: { fontSize: 8, color: WHITE },
  financeFinalLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: WHITE },
  financeFinalValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: GOLD },
  // Table
  table: { marginTop: 8 },
  tableHead: {
    flexDirection: "row",
    backgroundColor: DARK,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tableHeadCell: { fontSize: 7, color: "#AAAAAA", letterSpacing: 1, textTransform: "uppercase" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  tableRowAlt: { backgroundColor: "#FAFAF7" },
  tableCell: { fontSize: 8.5, color: INK },
  tableCellBold: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK },
  // Policy bullets
  policyItem: { flexDirection: "row", gap: 6, marginBottom: 5 },
  policyBullet: { fontSize: 8, color: GOLD, marginTop: 1 },
  policyText: { fontSize: 8, color: LIGHT, flex: 1, lineHeight: 1.5 },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK,
    paddingHorizontal: 48,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: "#888888" },
  // Signature
  sig: { marginTop: 24 },
  sigName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK },
  sigRole: { fontSize: 8, color: LIGHT, marginTop: 2 },
  sigHotel: { fontSize: 8, color: GOLD, marginTop: 1 },
  // Experience list
  expItem: { flexDirection: "row", gap: 6, marginBottom: 4 },
  expDash: { fontSize: 8, color: GOLD },
  expText: { fontSize: 8, color: LIGHT, flex: 1 },
})

const Footer = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerText}>{HOTEL.phone}</Text>
    <Text style={s.footerText}>{HOTEL.website}</Text>
    <Text style={s.footerText}>{HOTEL.emailGroups}</Text>
    <Text style={{ ...s.footerText, flex: 0 }}>{HOTEL.address}</Text>
  </View>
)

interface Props { quotation: Quotation }

export default function QuotationPDF({ quotation: q }: Props) {
  const nights = Math.round(
    (new Date(q.checkout).getTime() - new Date(q.checkin).getTime()) / 86400000
  )
  const totalRooms = q.rooms.reduce((s, r) => s + r.qty, 0)
  const totalDiarias = totalRooms * nights
  const discount = q.subtotal_bruto * q.desconto_percentual / 100

  return (
    <Document title={`Proposta ${q.proposal_number} — ${q.empresa}`} author={HOTEL.name}>
      {/* ── PAGE 1: Intro + Proposta + Investimento + Allotment ── */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logoText}>SAIS</Text>
          <Text style={s.logoSub}>BEACH LIVING HOTEL</Text>
          <View style={s.dateBlock}>
            <Text style={s.dateText}>Maceió, {formatDate(q.data_envio || q.created_at)}</Text>
            <Text style={s.proposalNum}>Proposta Nº {q.proposal_number}</Text>
          </View>
        </View>

        {/* Intro box */}
        <View style={s.intro}>
          <Text style={s.introTo}>Para: <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>{q.empresa}</Text>
            {"  "}Tipo de Cliente: <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>{q.tipo_cliente}</Text>
          </Text>
          <Text style={s.introName}>Aos cuidados de: Sr(a). {q.cliente}</Text>
          <Text style={s.introBody}>
            É um prazer apresentar nossa proposta para hospedagem de grupo no Sais Beach Living
            Hotel, concebido para proporcionar uma experiência contemporânea de hospitalidade,
            marcada por bem-estar, contemplação e sofisticação em uma das localizações mais
            desejadas de Maceió.
          </Text>
        </View>

        <View style={s.content}>
          {/* Proposta */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Proposta</Text>
            <View style={s.row2}>
              <Text style={s.label}>Check-in:</Text>
              <Text style={s.value}>{formatDate(q.checkin)}</Text>
            </View>
            <View style={s.row2}>
              <Text style={s.label}>Check-out:</Text>
              <Text style={s.value}>{formatDate(q.checkout)}</Text>
            </View>
            <View style={s.row2}>
              <Text style={s.label}>Estadia:</Text>
              <Text style={s.value}>{nights} noites  ·  {totalRooms} acomodações  ·  {totalDiarias} diárias no total</Text>
            </View>
            {q.nome_evento && (
              <View style={s.row2}>
                <Text style={s.label}>Evento:</Text>
                <Text style={s.value}>{q.nome_evento}</Text>
              </View>
            )}
          </View>

          {/* Acomodações e Tarifas */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Acomodações e Tarifas Acordadas</Text>
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={{ ...s.tableHeadCell, flex: 3 }}>Categoria</Text>
                <Text style={{ ...s.tableHeadCell, flex: 1, textAlign: "center" }}>Qtd</Text>
                <Text style={{ ...s.tableHeadCell, flex: 1, textAlign: "center" }}>Diária</Text>
                <Text style={{ ...s.tableHeadCell, flex: 2, textAlign: "right" }}>Subtotal</Text>
              </View>
              {q.rooms.filter(r => r.qty > 0).map((r, i) => (
                <View key={r.code} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                  <Text style={{ ...s.tableCell, flex: 3 }}>{r.name}</Text>
                  <Text style={{ ...s.tableCell, flex: 1, textAlign: "center" }}>{r.qty}</Text>
                  <Text style={{ ...s.tableCell, flex: 1, textAlign: "center" }}>{formatCurrency(r.rateDouble)}</Text>
                  <Text style={{ ...s.tableCellBold, flex: 2, textAlign: "right" }}>{formatCurrency(r.subtotal)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Investimento */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Investimento</Text>
            <View style={s.financeBox}>
              <View style={s.financeRow}>
                <Text style={s.financeLabel}>Subtotal hospedagem</Text>
                <Text style={s.financeValue}>{formatCurrency(q.subtotal_bruto)}</Text>
              </View>
              {q.desconto_percentual > 0 && (
                <View style={s.financeRow}>
                  <Text style={s.financeLabel}>Desconto comercial ({q.desconto_percentual}%)</Text>
                  <Text style={s.financeValue}>− {formatCurrency(discount)}</Text>
                </View>
              )}
              <View style={{ ...s.financeRow, borderTopWidth: 1, borderTopColor: "#333", paddingTop: 8, marginTop: 4 }}>
                <Text style={s.financeFinalLabel}>Total Final</Text>
                <Text style={s.financeFinalValue}>{formatCurrency(q.valor_final)}</Text>
              </View>
            </View>
          </View>

          {/* Allotment */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Allotment — Bloqueio das Unidades</Text>
            {q.rooms.filter(r => r.qty > 0).map((r) => (
              <View key={r.code} style={s.bullet}>
                <Text style={s.bulletDot}>●</Text>
                <Text style={s.bulletText}>{r.qty} apartamento{r.qty > 1 ? "s" : ""} categoria <Text style={{ fontFamily: "Helvetica-Bold" }}>{r.name}</Text></Text>
              </View>
            ))}
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 8, color: LIGHT }}>
                Total bloqueado: <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>{totalRooms} acomodações</Text>, nas configurações a serem definidas.
              </Text>
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* ── PAGE 2: Composição + Experiência + Condições ── */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.logoText}>SAIS</Text>
          <Text style={s.logoSub}>BEACH LIVING HOTEL</Text>
        </View>
        <View style={s.content}>
          {q.composicao_hospedagem && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Composição da Hospedagem</Text>
              <Text style={{ fontSize: 8.5, color: INK, lineHeight: 1.6 }}>{q.composicao_hospedagem}</Text>
            </View>
          )}

          <View style={s.section}>
            <Text style={s.sectionTitle}>Experiência Sais</Text>
            <Text style={{ fontSize: 8.5, color: LIGHT, marginBottom: 8, lineHeight: 1.5 }}>
              Durante a estada, os participantes poderão usufruir de experiências que traduzem o estilo de vida de Maceió:
            </Text>
            {[
              "Rooftop panorâmico com sunset experience",
              "Piscinas em diferentes ambientes",
              "Spa L'Occitane en Provence",
              "Fitness center e raia de natação",
              "Gastronomia autoral no Flor de Sal",
              "Serviço de praia e áreas de contemplação",
            ].map((item) => (
              <View key={item} style={s.expItem}>
                <Text style={s.expDash}>—</Text>
                <Text style={s.expText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Condições Comerciais</Text>
            {[
              "Café da manhã incluso nas hospedagens",
              "Tarifas sujeitas à disponibilidade no ato da confirmação",
              `Proposta válida por ${q.validade} dias`,
              "O bloqueio e confirmação estão sujeitos à formalização comercial e financeira",
            ].map((item) => (
              <View key={item} style={s.policyItem}>
                <Text style={s.policyBullet}>●</Text>
                <Text style={s.policyText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        <Footer />
      </Page>

      {/* ── PAGE 3: Observações + Rooming List + Garantias ── */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.logoText}>SAIS</Text>
          <Text style={s.logoSub}>BEACH LIVING HOTEL</Text>
        </View>
        <View style={s.content}>
          {q.observacoes && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Observações</Text>
              <Text style={{ fontSize: 8.5, color: INK, lineHeight: 1.6 }}>{q.observacoes}</Text>
            </View>
          )}

          <View style={s.section}>
            <Text style={s.sectionTitle}>Rooming List</Text>
            <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK, marginBottom: 6 }}>
              A Rooming List final deverá ser enviada até 30 dias antes do check-in.
            </Text>
            <Text style={{ fontSize: 8, color: LIGHT, marginBottom: 4 }}>Após este prazo:</Text>
            {[
              "Inclusões estarão sujeitas à disponibilidade",
              "Alterações poderão sofrer cobrança de taxa administrativa",
            ].map((item) => (
              <View key={item} style={s.policyItem}>
                <Text style={s.policyBullet}>●</Text>
                <Text style={s.policyText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Garantias</Text>
            <Text style={{ fontSize: 8, color: LIGHT, marginBottom: 6 }}>Para garantia do bloqueio:</Text>
            <Text style={{ fontSize: 8.5, color: INK, lineHeight: 1.6, marginBottom: 10 }}>{q.garantias}</Text>
            <Text style={{ fontSize: 8, color: LIGHT, marginBottom: 4 }}>Pagamento via:</Text>
            <View style={s.policyItem}>
              <Text style={s.policyBullet}>●</Text>
              <Text style={s.policyText}>Depósito bancário, transferência, PIX</Text>
            </View>
            <View style={{ marginTop: 8, backgroundColor: BEIGE, padding: 10 }}>
              <Text style={{ fontSize: 8, color: LIGHT }}>PIX: <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>{HOTEL.pix}</Text></Text>
              <Text style={{ fontSize: 8, color: LIGHT, marginTop: 3 }}>Dados bancários: <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>{HOTEL.bankInfo}</Text></Text>
            </View>
          </View>

          {q.codigo_promocional && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Benefício Extra para Participantes</Text>
              <View style={s.policyItem}>
                <Text style={s.policyBullet}>✔</Text>
                <Text style={s.policyText}>Cupom de 10% de desconto para reservas no site oficial do hotel após confirmação do grupo</Text>
              </View>
              <View style={s.policyItem}>
                <Text style={s.policyBullet}>✔</Text>
                <Text style={s.policyText}>Válido para extensão de hospedagem ou familiares</Text>
              </View>
              <Text style={{ fontSize: 8, color: INK, marginTop: 4 }}>Código promocional: <Text style={{ fontFamily: "Helvetica-Bold", color: GOLD }}>{q.codigo_promocional}</Text></Text>
            </View>
          )}
        </View>
        <Footer />
      </Page>

      {/* ── PAGE 4: Políticas ── */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.logoText}>SAIS</Text>
          <Text style={s.logoSub}>BEACH LIVING HOTEL</Text>
        </View>
        <View style={s.content}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>Política de Cancelamento e Alteração</Text>
            <Text style={{ fontSize: 8.5, color: LIGHT, marginBottom: 8, lineHeight: 1.5 }}>
              Cancelamentos poderão ser realizados sem multa até <Text style={{ fontFamily: "Helvetica-Bold", color: INK }}>30 dias antes do check-in.</Text>
            </Text>
            {[
              "Até 25 dias antes → cobrança de 01 diária por apartamento bloqueado",
              "Até 20 dias antes → cobrança de 50% do valor total do bloqueio",
              "Menos de 15 dias → cobrança de 100% do valor do bloqueio",
            ].map((item) => (
              <View key={item} style={s.policyItem}>
                <Text style={s.policyBullet}>●</Text>
                <Text style={s.policyText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>No Show</Text>
            <View style={s.policyItem}>
              <Text style={s.policyBullet}>●</Text>
              <Text style={s.policyText}>Em caso de não comparecimento: cobrança integral da reserva</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Remarcação</Text>
            <Text style={{ fontSize: 8.5, color: LIGHT, marginBottom: 6, lineHeight: 1.5 }}>
              Até <Text style={{ fontFamily: "Helvetica-Bold" }}>60 dias antes da chegada</Text>, poderá ser solicitada remarcação do evento mediante:
            </Text>
            {[
              "Análise de disponibilidade",
              "Concessão de carta de crédito no valor pago",
            ].map((item) => (
              <View key={item} style={s.policyItem}>
                <Text style={s.policyBullet}>●</Text>
                <Text style={s.policyText}>{item}</Text>
              </View>
            ))}
            <Text style={{ fontSize: 8, color: LIGHT, marginTop: 6 }}>Após este prazo não haverá reembolso.</Text>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Política de Redução de Bloqueio</Text>
            {[
              "Reduções poderão ser realizadas até 90 dias antes do check-in, limitadas a 25% do volume total inicialmente contratado",
              "Reduções adicionais serão tarifadas conforme política de cancelamento",
            ].map((item) => (
              <View key={item} style={s.policyItem}>
                <Text style={s.policyBullet}>●</Text>
                <Text style={s.policyText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Reajuste Tarifário</Text>
            <View style={s.policyItem}>
              <Text style={s.policyBullet}>●</Text>
              <Text style={s.policyText}>Tarifas poderão ser reajustadas em caso de alteração relevante de carga tributária, força maior ou mudanças estruturais no evento</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Força Maior</Text>
            <Text style={{ fontSize: 8.5, color: LIGHT, marginBottom: 6 }}>Eventos como pandemias, desastres naturais e restrições governamentais poderão gerar revisão contratual mediante negociação entre as partes.</Text>
          </View>

          {/* Signature */}
          <View style={[s.sig, { marginTop: 36 }]}>
            <Text style={{ fontSize: 8, color: LIGHT }}>Atenciosamente,</Text>
            <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER, width: 160 }}>
              <Text style={s.sigName}>{HOTEL.executive}</Text>
              <Text style={s.sigRole}>{HOTEL.executiveTitle}</Text>
              <Text style={s.sigHotel}>{HOTEL.name}</Text>
            </View>
          </View>
        </View>
        <Footer />
      </Page>
    </Document>
  )
}
