import React, { Component } from 'react';
import platform from 'platform';

import socket from '@/socket';
import action from '@/state/action';
import { Tabs, TabPane, TabContent, ScrollableInkTabBar } from '@/components/Tabs';
import Input from '@/components/Input';
import Message from '@/components/Message';
import './Login.less';

class Login extends Component {
    handleLogin = () => {
        socket.emit('login', {
            username: this.loginUsername.getValue(),
            password: this.loginPassword.getValue(),
            os: platform.os.family,
            browser: platform.name,
            environment: platform.description,
        }, (res) => {
            if (typeof res === 'string') {
                Message.error(res);
            } else {
                action.setUser(res);
                action.closeLoginDialog();
                window.localStorage.setItem('token', res.token);
            }
        });
    }
    handleRegister = () => {
        socket.emit('register', {
            username: this.registerUsername.getValue(),
            password: this.registerPassword.getValue(),
            os: platform.os.family,
            browser: platform.name,
            environment: platform.description,
        }, (res) => {
            if (typeof res === 'string') {
                Message.error(res);
            } else {
                Message.success('Created successfully');
                action.setUser(res);
                action.closeLoginDialog();
                window.localStorage.setItem('token', res.token);
            }
        });
    }
    renderLogin() {
        return (
            <div className="pane">
                <h3>username</h3>
                <Input ref={i => this.loginUsername = i} onEnter={this.handleLogin} />
                <h3>password</h3>
                <Input type="password" ref={i => this.loginPassword = i} onEnter={this.handleLogin} />
                <button onClick={this.handleLogin}>login</button>
            </div>
        );
    }
    renderRegister() {
        return (
            <div className="pane">
                <h3>username</h3>
                <Input ref={i => this.registerUsername = i} onEnter={this.handleRegister} placeholder="User name is nickname, please fill in carefully, can not be modified" />
                <h3>password</h3>
                <Input type="password" ref={i => this.registerPassword = i} onEnter={this.handleRegister} placeholder="Temporarily no change to password" />
                <button onClick={this.handleRegister}>register</button>
            </div>
        );
    }
    render() {
        return (
            <Tabs
                className="main-login"
                defaultActiveKey="login"
                renderTabBar={() => <ScrollableInkTabBar />}
                renderTabContent={() => <TabContent />}
            >
                <TabPane tab="login" key="login">
                    {this.renderLogin()}
                </TabPane>
                <TabPane tab="register" key="register">
                    {this.renderRegister()}
                </TabPane>
            </Tabs>
        );
    }
}

export default Login;
