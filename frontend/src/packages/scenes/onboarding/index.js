// @flow

import * as React from 'react';
import {StyleSheet, Colors, Title, SplitScreen, EmailInput, Button, FormGroup} from '_shared';
import Translation from '_translations';
import {warning} from '_utils';

const OnboardingTop = () => (
  <React.Fragment>
    <Title style={styleSheet.title}>
      <Translation id="Onboarding.Title" />
    </Title>
    <Translation id="Onboarding.Subtitle" />
  </React.Fragment>
);

type State = {|
  formIsValid: boolean,
|};

// TODO: submit only if all fields are valid
class OnboardingBottom extends React.Component<{||}, State> {
  state = {
    formIsValid: false,
  };

  handleValidationFormCheck = isValid =>
    this.setState({
      formIsValid: isValid,
      // TODO: form values (?)
    });

  handleFormSubmit = () => {
    warning(false, 'TODO: form values');
  };

  render = () => {
    return (
      <FormGroup onValidationCheck={this.handleValidationFormCheck}>
        <EmailInput placeholder={<Translation id="Onboarding.Email" />} />

        <Button
          disabled={!this.state.formIsValid}
          omitValidation={true}
          title={<Translation id="Onboarding.Email.Submit" />}
          onPress={this.handleFormSubmit}
        />
      </FormGroup>
    );
  };
}

/**
 * Welcome page of the onboarding should combine login and registration into
 * one simple process.
 */
export default () => (
  <SplitScreen childrenTop={<OnboardingTop />} childrenBottom={<OnboardingBottom />} />
);

const styleSheet = StyleSheet.create({
  title: {
    color: Colors.white,
  },
});
