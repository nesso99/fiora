import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import Dialog from '@/components/Dialog';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Message from '@/components/Message';
import fetch from '../../../../utils/fetch';

@immutableRenderDecorator
class AdminDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            sealList: [],
        };
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.visible === false && nextProps.visible === true) {
            this.getSealList();
        }
    }
    getSealList = async () => {
        const [err, res] = await fetch('getSealList');
        if (!err) {
            this.setState({
                sealList: res,
            });
        }
    }
    handleResetPassword = async () => {
        const [err, res] = await fetch('resetUserPassword', { username: this.resetPasswordUsername.getValue() });
        if (!err) {
            Message.success(`The user’s password has been reset to:${res.newPassword}`);
        }
    }
    /**
     * 处理封禁用户操作
     */
    handleSeal = async () => {
        const [err] = await fetch('sealUser', { username: this.sealUsername.getValue() });
        if (!err) {
            Message.success('Blocking user success');
            this.getSealList();
        }
    }
    render() {
        const { visible, onClose } = this.props;
        return (
            <Dialog className="dialog admin" visible={visible} title="Administrator console" onClose={onClose}>
                <div className="content">
                    <div>
                        <p>Reset user password</p>
                        <div className="reset-user-password">
                            <Input ref={i => this.resetPasswordUsername = i} placeholder="Username to reset the password" />
                            <Button onClick={this.handleResetPassword}>submit</Button>
                        </div>
                    </div>
                    <div>
                        <p>Ban user</p>
                        <div className="seal">
                            <Input ref={i => this.sealUsername = i} placeholder="User name to be banned" />
                            <Button onClick={this.handleSeal}>submit</Button>
                        </div>
                    </div>
                    <div>
                        <p>Blocked user list</p>
                        <div className="seal-list">
                            {
                                this.state.sealList.map(username => (
                                    <span key={username}>{username}</span>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default AdminDialog;
