import React, { Component } from 'react';
import { Form,Tabs } from 'antd';
import classNames from 'classnames';
import LoginItem from './LoginItem';
import FormTab from '../FormTab';
import LoginSubmit from '../SubmitFormItem';
import FormContext from '../formContext';
import styles from './index.less'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
          type: props.defaultActiveKey,
          tabs: [],
          active: {},
        };
    }

    onSwitch = type => {
        this.setState({
            type,
        });
        const { onTabChange } = this.props;
        onTabChange(type);
    };

    getContext = () => {
        const { tabs } = this.state;
        const { form } = this.props;
        return {
            tabUtil: {
            addTab: id => {
                this.setState({
                tabs: [...tabs, id],
                });
            },
            removeTab: id => {
                this.setState({
                tabs: tabs.filter(currentId => currentId !== id),
                });
            },
            },
            form,
            updateActive: activeItem => {
            const { type, active } = this.state;
            if (active[type]) {
                active[type].push(activeItem);
            } else {
                active[type] = [activeItem];
            }
            this.setState({
                active,
            });
            },
        };
    };

  handleSubmit = e => {
    e.preventDefault();
    const { active, type } = this.state;
    const { form, onSubmit } = this.props;
    const activeFileds = active[type];
    form.validateFields(activeFileds, { force: true }, (err, values) => {
      onSubmit(err, values);
    });
  };

  render() {
    const { className, children } = this.props;
    const { type, tabs } = this.state;
    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
      // eslint-disable-next-line
      if (item.type.typeName === 'FormTab') {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });
    return (
      <FormContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.loginForm)}>
          <Form onSubmit={this.handleSubmit}>
            {tabs.length ? (
                <React.Fragment>
                    <Tabs
                    animated={false}
                    className={styles.tabs}
                    activeKey={type}
                    onChange={this.onSwitch}
                    >
                    {TabChildren}
                    </Tabs>
                    {otherChildren}
                </React.Fragment>
                ) : children}
          </Form>
        </div>
      </FormContext.Provider>
    );
  }
}

Login.Tab = FormTab;
LoginItem.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
    Login[item] = LoginItem[item];
});

export default Form.create()(Login);