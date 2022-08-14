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
    intl.formatMessage({id: "quotes.hdt1"})
]
const random = Math.floor(Math.random() * Quotes.length);

return Quotes[random];
}