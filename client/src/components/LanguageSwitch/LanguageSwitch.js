import React from 'react';
import { IntlContext, languages } from '../../context/IntlContext';
import Form from 'react-bootstrap/Form';
import { FormattedMessage } from 'react-intl';
export default function LangaugeSwitch() {
  const { handleChange } = React.useContext(IntlContext);
  return (
    <div>
      <Form>
        <Form.Select onChange={handleChange}>
          <option value="en">
            <FormattedMessage id="option.language" />
          </option>
          {Object.keys(languages).map((lang) => {
            return (
              <option key={lang} value={lang}>
                {lang}
              </option>
            );
          })}
        </Form.Select>
      </Form>
    </div>
  );
}
