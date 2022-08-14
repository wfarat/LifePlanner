import { useIntl } from "react-intl"
export default function useRandomQuote() {
const intl = useIntl()
const Quotes = [
    intl.formatMessage({id: "quotes.ma1"}),
    intl.formatMessage({id: "quotes.wd1"}),
    intl.formatMessage({id: "quotes.ow1"}),
    intl.formatMessage({id: "quotes.sj1"}),
    intl.formatMessage({id: "quotes.te1"}),
    intl.formatMessage({id: "quotes.q1"}),
    intl.formatMessage({id: "quotes.hdt1"}),
    intl.formatMessage({id: "quotes.ae1"}),
    intl.formatMessage({id: "quotes.mg1"}),
    intl.formatMessage({id: "quotes.mg2"}),
    intl.formatMessage({id: "quotes.wwp1"}),
    intl.formatMessage({id: "quotes.gbs1"}),
    intl.formatMessage({id: "quotes.wj1"}),
    intl.formatMessage({id: "quotes.wj2"}),
    intl.formatMessage({id: "quotes.er1"}),
    intl.formatMessage({id: "quotes.ma2"}),
    intl.formatMessage({id: "quotes.ma3"}),
    intl.formatMessage({id: "quotes.wsc1"}),
    intl.formatMessage({id: "quotes.hf1"}),
    intl.formatMessage({id: "quotes.rn1"}),
    intl.formatMessage({id: "quotes.wsc2"}),
    intl.formatMessage({id: "quotes.fn1"}),
    intl.formatMessage({id: "quotes.fn2"}),
]
const random = Math.floor(Math.random() * Quotes.length);

return Quotes[random];
}