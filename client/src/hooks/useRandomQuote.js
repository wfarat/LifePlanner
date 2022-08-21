import { useIntl } from 'react-intl';
export default function useRandomQuote() {
  const intl = useIntl();
  const Quotes = [
    intl.formatMessage({ id: 'quotes.ma1' }),
    intl.formatMessage({ id: 'quotes.wd1' }),
    intl.formatMessage({ id: 'quotes.ow1' }),
    intl.formatMessage({ id: 'quotes.sj1' }),
    intl.formatMessage({ id: 'quotes.te1' }),
    intl.formatMessage({ id: 'quotes.q1' }),
    intl.formatMessage({ id: 'quotes.hdt1' }),
    intl.formatMessage({ id: 'quotes.ae1' }),
    intl.formatMessage({ id: 'quotes.mg1' }),
    intl.formatMessage({ id: 'quotes.mg2' }),
    intl.formatMessage({ id: 'quotes.wwp1' }),
    intl.formatMessage({ id: 'quotes.gbs1' }),
    intl.formatMessage({ id: 'quotes.wj1' }),
    intl.formatMessage({ id: 'quotes.wj2' }),
    intl.formatMessage({ id: 'quotes.er1' }),
    intl.formatMessage({ id: 'quotes.ma2' }),
    intl.formatMessage({ id: 'quotes.ma3' }),
    intl.formatMessage({ id: 'quotes.wsc1' }),
    intl.formatMessage({ id: 'quotes.hf1' }),
    intl.formatMessage({ id: 'quotes.rn1' }),
    intl.formatMessage({ id: 'quotes.rc1' }),
    intl.formatMessage({ id: 'quotes.wsc2' }),
    intl.formatMessage({ id: 'quotes.fn1' }),
    intl.formatMessage({ id: 'quotes.fn2' }),
    intl.formatMessage({ id: 'quotes.er2' }),
    intl.formatMessage({ id: 'quotes.er3' }),
    intl.formatMessage({ id: 'quotes.er4' }),
    intl.formatMessage({ id: 'quotes.mt1' }),
    intl.formatMessage({ id: 'quotes.wj3' }),
    intl.formatMessage({ id: 'quotes.wj4' }),
    intl.formatMessage({ id: 'quotes.e1' }),
    intl.formatMessage({ id: 'quotes.e2' }),
    intl.formatMessage({ id: 'quotes.e3' }),
    intl.formatMessage({ id: 'quotes.jwg1' }),
    intl.formatMessage({ id: 'quotes.jwg2' }),
    intl.formatMessage({ id: 'quotes.s1' }),
    intl.formatMessage({ id: 'quotes.s2' }),
    intl.formatMessage({ id: 'quotes.s3' }),
    intl.formatMessage({ id: 'quotes.cc1' }),
    intl.formatMessage({ id: 'quotes.cc2' }),
    intl.formatMessage({ id: 'quotes.cc3' }),
    intl.formatMessage({ id: 'quotes.ma4' }),
    intl.formatMessage({ id: 'quotes.lt1' }),
    intl.formatMessage({ id: 'quotes.mw1' }),
    intl.formatMessage({ id: 'quotes.bmb1' }),
    intl.formatMessage({ id: 'quotes.jkr1' }),
    intl.formatMessage({ id: 'quotes.ow2' }),
    intl.formatMessage({ id: 'quotes.ws1' }),
    intl.formatMessage({ id: 'quotes.te2' }),
    intl.formatMessage({ id: 'quotes.tr1' }),
    intl.formatMessage({ id: 'quotes.tr2' }),
    intl.formatMessage({ id: 'quotes.tr3' }),
  ];
  const random = Math.floor(Math.random() * Quotes.length);

  return Quotes[random];
}
