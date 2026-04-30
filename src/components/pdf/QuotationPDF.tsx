import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { ReactNode } from "react"
import type { Quotation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { HOTEL } from "@/lib/constants"

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
})

const INK = "#10100E"
const CHARCOAL = "#171511"
const GOLD = "#B99A5B"
const GOLD_LIGHT = "#D0B880"
const SAND = "#F4F0E8"
const SAND_DARK = "#D8CBB8"
const STONE = "#5F5A53"
const MUTED = "#8D867B"
const WHITE = "#FFFFFF"

function parseDateParts(date: Date | string) {
  const value = typeof date === "string" ? date : date.toISOString().slice(0, 10)
  const [year, month, day] = value.slice(0, 10).split("-")
  return { year, month, day }
}

function longDate(date: Date | string) {
  const { year, month, day } = parseDateParts(date)
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`
}

function shortDate(date: Date | string) {
  const { year, month, day } = parseDateParts(date)
  return `${day}/${month}/${year}`
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    color: INK,
    fontSize: 9,
    paddingBottom: 58,
    backgroundColor: WHITE,
  },
  cover: {
    backgroundColor: CHARCOAL,
    color: WHITE,
    paddingHorizontal: 44,
    paddingTop: 38,
    paddingBottom: 34,
  },
  coverTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontFamily: "Times-Roman",
    fontSize: 34,
    letterSpacing: 9,
    color: GOLD_LIGHT,
  },
  logoSub: {
    marginTop: 4,
    fontSize: 7,
    letterSpacing: 4,
    color: GOLD_LIGHT,
    textTransform: "uppercase",
  },
  proposalPill: {
    borderWidth: 1,
    borderColor: GOLD,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  proposalPillLabel: {
    fontSize: 6,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
    textAlign: "right",
  },
  proposalPillValue: {
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: WHITE,
    textAlign: "right",
  },
  coverTitleBlock: {
    marginTop: 58,
    width: "76%",
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    paddingLeft: 18,
  },
  eyebrow: {
    fontSize: 7,
    letterSpacing: 2.4,
    color: GOLD_LIGHT,
    textTransform: "uppercase",
  },
  coverTitle: {
    marginTop: 10,
    fontFamily: "Times-Roman",
    fontSize: 30,
    lineHeight: 1.05,
    color: WHITE,
  },
  coverText: {
    marginTop: 14,
    width: "78%",
    fontSize: 9,
    lineHeight: 1.55,
    color: "#D8D4CB",
  },
  coverMeta: {
    marginTop: 34,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#39352C",
    paddingTop: 18,
  },
  metaItem: {
    flex: 1,
    paddingRight: 14,
  },
  metaLabel: {
    fontSize: 6.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: MUTED,
  },
  metaValue: {
    marginTop: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: WHITE,
    lineHeight: 1.35,
  },
  body: {
    paddingHorizontal: 44,
    paddingTop: 28,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionRule: {
    width: 24,
    height: 1,
    backgroundColor: GOLD,
    marginRight: 9,
  },
  sectionTitle: {
    fontSize: 7.5,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    color: GOLD,
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.58,
    color: STONE,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: SAND,
    borderWidth: 1,
    borderColor: SAND_DARK,
    padding: 12,
  },
  infoLabel: {
    fontSize: 6.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: MUTED,
  },
  infoValue: {
    marginTop: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: INK,
    lineHeight: 1.35,
  },
  table: {
    borderWidth: 1,
    borderColor: SAND_DARK,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: CHARCOAL,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeadText: {
    color: GOLD_LIGHT,
    fontSize: 6.7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: SAND_DARK,
    alignItems: "center",
  },
  tableAlt: {
    backgroundColor: "#FBF8F2",
  },
  cell: {
    fontSize: 8.5,
    color: INK,
  },
  cellMuted: {
    fontSize: 8,
    color: STONE,
  },
  cellBold: {
    fontSize: 8.5,
    color: INK,
    fontFamily: "Helvetica-Bold",
  },
  investment: {
    marginTop: 2,
    backgroundColor: CHARCOAL,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  investmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  investmentLabel: {
    fontSize: 8,
    color: "#BDB7AC",
  },
  investmentValue: {
    fontSize: 8.5,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
  },
  investmentFinal: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#413D33",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  investmentFinalLabel: {
    color: WHITE,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  investmentFinalValue: {
    color: GOLD_LIGHT,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletMark: {
    width: 12,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: STONE,
  },
  noteBox: {
    backgroundColor: SAND,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    padding: 12,
  },
  noteText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: STONE,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CHARCOAL,
    paddingHorizontal: 44,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    color: "#A9A399",
    fontSize: 6.8,
  },
  footerBrand: {
    color: GOLD_LIGHT,
    fontSize: 7,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
  },
  signature: {
    marginTop: 26,
    width: 200,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: SAND_DARK,
  },
  signatureName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: INK,
  },
  signatureMeta: {
    marginTop: 3,
    fontSize: 8,
    color: STONE,
  },
})

const Footer = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerBrand}>SAIS</Text>
    <Text style={s.footerText}>{HOTEL.phone}</Text>
    <Text style={s.footerText}>{HOTEL.emailGroups}</Text>
    <Text style={s.footerText}>{HOTEL.website}</Text>
  </View>
)

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.sectionRule} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

interface Props {
  quotation: Quotation
}

export default function QuotationPDF({ quotation: q }: Props) {
  const nights = Math.round(
    (new Date(q.checkout).getTime() - new Date(q.checkin).getTime()) / 86400000
  )
  const visibleRooms = q.rooms.filter((r) => r.qty > 0)
  const totalRooms = visibleRooms.reduce((sum, room) => sum + room.qty, 0)
  const totalNights = totalRooms * nights
  const discount = (q.subtotal_bruto * q.desconto_percentual) / 100

  return (
    <Document title={`Proposta ${q.proposal_number} - ${q.empresa}`} author={HOTEL.name}>
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.coverTop}>
            <View>
              <Text style={s.logo}>SAIS</Text>
              <Text style={s.logoSub}>Beach Living Hotel</Text>
            </View>
            <View style={s.proposalPill}>
              <Text style={s.proposalPillLabel}>Proposta</Text>
              <Text style={s.proposalPillValue}>{q.proposal_number}</Text>
            </View>
          </View>

          <View style={s.coverTitleBlock}>
            <Text style={s.eyebrow}>Grupos & Eventos</Text>
            <Text style={s.coverTitle}>Proposta de hospedagem para {q.nome_evento}</Text>
            <Text style={s.coverText}>
              Uma experiência de hospedagem contemporânea, com localização à beira-mar em Pajuçara,
              estrutura para grupos e gastronomia assinada no Flor de Sal.
            </Text>
          </View>

          <View style={s.coverMeta}>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Cliente</Text>
              <Text style={s.metaValue}>{q.empresa}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Contato</Text>
              <Text style={s.metaValue}>{q.cliente}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Período</Text>
              <Text style={s.metaValue}>{shortDate(q.checkin)} a {shortDate(q.checkout)}</Text>
            </View>
          </View>
        </View>

        <View style={s.body}>
          <Section title="Resumo da proposta">
            <View style={s.twoCol}>
              <View style={s.infoCard}>
                <Text style={s.infoLabel}>Estadia</Text>
                <Text style={s.infoValue}>{nights} noites, {totalRooms} acomodações, {totalNights} diárias</Text>
              </View>
              <View style={s.infoCard}>
                <Text style={s.infoLabel}>Tipo de cliente</Text>
                <Text style={s.infoValue}>{q.tipo_cliente}</Text>
              </View>
              <View style={s.infoCard}>
                <Text style={s.infoLabel}>Emissão</Text>
                <Text style={s.infoValue}>Maceió, {longDate(q.data_envio || q.created_at)}</Text>
              </View>
            </View>
          </Section>

          <Section title="Acomodações e tarifas acordadas">
            <View style={s.table}>
              <View style={s.tableHead}>
                <Text style={{ ...s.tableHeadText, flex: 3 }}>Categoria</Text>
                <Text style={{ ...s.tableHeadText, flex: 1, textAlign: "center" }}>Qtd</Text>
                <Text style={{ ...s.tableHeadText, flex: 1.3, textAlign: "center" }}>Diária</Text>
                <Text style={{ ...s.tableHeadText, flex: 1.6, textAlign: "right" }}>Subtotal</Text>
              </View>
              {visibleRooms.map((room, index) => (
                <View key={room.code} style={[s.tableRow, index % 2 ? s.tableAlt : {}]}>
                  <Text style={{ ...s.cellBold, flex: 3 }}>{room.name}</Text>
                  <Text style={{ ...s.cell, flex: 1, textAlign: "center" }}>{room.qty}</Text>
                  <Text style={{ ...s.cellMuted, flex: 1.3, textAlign: "center" }}>{formatCurrency(room.rateDouble)}</Text>
                  <Text style={{ ...s.cellBold, flex: 1.6, textAlign: "right" }}>{formatCurrency(room.subtotal)}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Investimento">
            <View style={s.investment}>
              <View style={s.investmentRow}>
                <Text style={s.investmentLabel}>Subtotal hospedagem</Text>
                <Text style={s.investmentValue}>{formatCurrency(q.subtotal_bruto)}</Text>
              </View>
              {q.desconto_percentual > 0 && (
                <View style={s.investmentRow}>
                  <Text style={s.investmentLabel}>Desconto comercial ({q.desconto_percentual}%)</Text>
                  <Text style={s.investmentValue}>- {formatCurrency(discount)}</Text>
                </View>
              )}
              <View style={s.investmentFinal}>
                <Text style={s.investmentFinalLabel}>Total final</Text>
                <Text style={s.investmentFinalValue}>{formatCurrency(q.valor_final)}</Text>
              </View>
            </View>
          </Section>

          <Section title="Allotment">
            {visibleRooms.map((room) => (
              <View key={room.code} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{room.qty} apartamento{room.qty > 1 ? "s" : ""} categoria {room.name}</Text>
              </View>
            ))}
          </Section>
        </View>
        <Footer />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.body}>
          <Section title="Composição da hospedagem">
            <View style={s.noteBox}>
              <Text style={s.noteText}>
                {q.composicao_hospedagem || "Hospedagem em apartamentos selecionados, conforme disponibilidade e condições comerciais desta proposta."}
              </Text>
            </View>
          </Section>

          <Section title="Experiência Sais">
            {[
              "A 3 minutos do Centro de Convenções.",
              "Estrutura completa no rooftop para momentos de convivência, contemplação e eventos.",
              "Bistrot e Bar Flor de Sal assinado pelo Chef Wanderson Medeiros @Picui.",
              "Spa L´Occitane en Provence (em breve).",
              "Localização à beira-mar em Pajuçara, próxima às piscinas naturais.",
            ].map((item) => (
              <View key={item} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          <Section title="Condições comerciais">
            {[
              "Café da manhã incluso nas hospedagens.",
              "Tarifas sujeitas à disponibilidade no ato da confirmação.",
              `Proposta válida por ${q.validade} dias.`,
              "Bloqueio e confirmação sujeitos à formalização comercial e financeira.",
            ].map((item) => (
              <View key={item} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          <Section title="Garantias e pagamento">
            <Text style={s.paragraph}>{q.garantias}</Text>
            <View style={{ ...s.noteBox, marginTop: 12 }}>
              <Text style={s.noteText}>PIX: {HOTEL.pix}</Text>
              <Text style={{ ...s.noteText, marginTop: 4 }}>Dados bancários: {HOTEL.bankInfo}</Text>
            </View>
          </Section>

          {q.observacoes && (
            <Section title="Observações">
              <Text style={s.paragraph}>{q.observacoes}</Text>
            </Section>
          )}
        </View>
        <Footer />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.body}>
          <Section title="Rooming list">
            <Text style={s.paragraph}>
              A rooming list final deverá ser enviada até 30 dias antes do check-in. Após este prazo,
              inclusões estarão sujeitas à disponibilidade e alterações poderão sofrer cobrança de taxa administrativa.
            </Text>
          </Section>

          <Section title="Política de cancelamento e alteração">
            {[
              "Cancelamentos sem multa até 30 dias antes do check-in.",
              "Até 25 dias antes: cobrança de 01 diária por apartamento bloqueado.",
              "Até 20 dias antes: cobrança de 50% do valor total do bloqueio.",
              "Menos de 15 dias: cobrança de 100% do valor do bloqueio.",
              "No show: cobrança integral da reserva.",
            ].map((item) => (
              <View key={item} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          <Section title="Remarcação e redução de bloqueio">
            {[
              "Até 60 dias antes da chegada, poderá ser solicitada remarcação mediante análise de disponibilidade.",
              "Reduções poderão ser realizadas até 90 dias antes do check-in, limitadas a 25% do volume inicialmente contratado.",
              "Reduções adicionais serão tarifadas conforme política de cancelamento.",
              "Tarifas poderão ser reajustadas em caso de alteração relevante de carga tributária, força maior ou mudanças estruturais no evento.",
            ].map((item) => (
              <View key={item} style={s.bulletRow}>
                <Text style={s.bulletMark}>•</Text>
                <Text style={s.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>

          {q.codigo_promocional && (
            <Section title="Benefício extra para participantes">
              <Text style={s.paragraph}>
                Após confirmação do grupo, participantes poderão utilizar o código promocional {q.codigo_promocional}
                para condições especiais em reservas elegíveis no site oficial.
              </Text>
            </Section>
          )}

          <View style={s.signature}>
            <Text style={s.signatureName}>{HOTEL.executive}</Text>
            <Text style={s.signatureMeta}>{HOTEL.executiveTitle}</Text>
            <Text style={s.signatureMeta}>{HOTEL.name}</Text>
          </View>
        </View>
        <Footer />
      </Page>
    </Document>
  )
}
