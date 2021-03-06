// @flow

import * as React from 'react';
import {Layout, NumericInput, Button} from '_shared';
import Translation from '_translations';

const VoidCallback = () => {};

export default () => (
  <Layout title={<Translation id="Payment.Title" />}>
    <Translation id="General.TODO" />
    <NumericInput placeholder={<Translation id="General.TODO" />} />
    <Button title={<Translation id="General.TODO" />} onPress={VoidCallback} />
  </Layout>
);
