import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import Input from '@/components/Input';
import Dialog from '@/components/Dialog';
import Button from '@/components/Button';
import Message from '@/components/Message';
import action from '@/state/action';
import socket from '@/socket';

import fetch from 'utils/fetch';
import readDiskFile from 'utils/readDiskFile';
import uploadFile from 'utils/uploadFile';
import config from '../../../../config/client';


class SelfInfo extends Component {
    /**
     * 让用户重新登录
     * @param {string} message 提示消息
     */
    static reLogin(message) {
        action.logout();
        window.localStorage.removeItem('token');
        Message.success(message);
        socket.disconnect();
        socket.connect();
    }
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        userId: PropTypes.string,
        avatar: PropTypes.string,
        primaryColor: PropTypes.string.isRequired,
    }
    state = {
        loading: false,
        cropper: false,
        cropperSrc: '',
        cropperExt: 'png',
    }
    toggleAvatarLoading = () => {
        this.setState({
            loading: !this.state.loading,
        });
    }
    /**
     * 修改头像
     */
    selectAvatar = async () => {
        const file = await readDiskFile('blob', 'image/png,image/jpeg,image/gif');
        if (!file) {
            return;
        }
        if (file.length > config.maxAvatarSize) {
            return Message.error('Failed to set avatar, please select less than 1MB image');
        }

        // gif头像不需要裁剪
        if (file.ext === 'gif') {
            this.uploadAvatar(file.result, file.ext);
        } else {
            // 显示头像裁剪
            const reader = new FileReader();
            reader.readAsDataURL(file.result);
            reader.onloadend = () => {
                this.setState({
                    cropper: true,
                    cropperSrc: reader.result,
                    cropperExt: file.ext,
                });
            };
        }
    }
    uploadAvatar = async (blob, ext = 'png') => {
        this.toggleAvatarLoading();

        try {
            const avatarUrl = await uploadFile(blob, `Avatar/${this.props.userId}_${Date.now()}`, `Avatar_${this.props.userId}_${Date.now()}.${ext}`);
            const [changeAvatarErr] = await fetch('changeAvatar', { avatar: avatarUrl });
            if (changeAvatarErr) {
                Message.error(changeAvatarErr);
            } else {
                action.setAvatar(URL.createObjectURL(blob));
                Message.success('Modify avatar successfully');
                this.setState({ cropper: false });
            }
        } catch (err) {
            console.error(err);
            Message.error('Uploading avatar failed');
        } finally {
            this.toggleAvatarLoading();
        }
    }
    changeAvatar = () => {
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
            this.uploadAvatar(blob, this.state.cropperExt);
        });
    }
    /**
     * 修改密码
     */
    changePassword = async () => {
        const [err] = await fetch('changePassword', {
            oldPassword: this.oldPassword.getValue(),
            newPassword: this.newPassword.getValue(),
        });
        if (!err) {
            this.props.onClose();
            SelfInfo.reLogin('The password was changed successfully. Please log in again with the new password.');
        }
    }
    /**
     * 修改用户名
     */
    changeUsername = async () => {
        const [err] = await fetch('changeUsername', {
            username: this.username.getValue(),
        });
        if (!err) {
            this.props.onClose();
            SelfInfo.reLogin('The user name was changed successfully. Please log in again with the new username.');
        }
    }
    render() {
        const { visible, onClose, avatar, primaryColor } = this.props;
        const { loading, cropper, cropperSrc } = this.state;
        return (
            <Dialog className="dialog selfInfo" visible={visible} title="Personal information settings" onClose={onClose}>
                <div className="content">
                    <div>
                        <p>Modify avatar</p>
                        <div className="avatar-preview">
                            {
                                cropper ?
                                    <div className="cropper">
                                        <Cropper
                                            className={loading ? 'blur' : ''}
                                            ref={i => this.cropper = i}
                                            src={cropperSrc}
                                            style={{ height: 460, width: 460 }}
                                            aspectRatio={1}
                                        />
                                        <Button onClick={this.changeAvatar}>Modify avatar</Button>
                                        <ReactLoading className={`loading ${loading ? 'show' : 'hide'}`} type="spinningBubbles" color={`rgb(${primaryColor}`} height={120} width={120} />
                                    </div>
                                    :
                                    <div className="preview">
                                        <img className={loading ? 'blur' : ''} src={avatar} onClick={this.selectAvatar} />
                                        <ReactLoading className={`loading ${loading ? 'show' : 'hide'}`} type="spinningBubbles" color={`rgb(${primaryColor}`} height={80} width={80} />
                                    </div>
                            }
                        </div>
                    </div>
                    <div>
                        <p>change password</p>
                        <div className="change-password">
                            <Input ref={i => this.oldPassword = i} type="password" placeholder="old password" />
                            <Input ref={i => this.newPassword = i} type="password" placeholder="new password" />
                            <Button onClick={this.changePassword}>change password</Button>
                        </div>
                    </div>
                    <div>
                        <p>modify username</p>
                        <div className="change-username">
                            <Input ref={i => this.username = i} type="text" placeholder="username" />
                            <Button onClick={this.changeUsername}>modify username</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default connect(state => ({
    avatar: state.getIn(['user', 'avatar']),
    primaryColor: state.getIn(['ui', 'primaryColor']),
    userId: state.getIn(['user', '_id']),
}))(SelfInfo);
