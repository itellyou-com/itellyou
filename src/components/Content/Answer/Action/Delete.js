import React from 'react';
import { DeleteButton } from '@/components/Button';
import { Modal } from 'antd';
import { useDispatch } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default ({ id, question_id, allow_delete, title, callback, ...props }) => {
    const dispatch = useDispatch();

    const onDelete = () => {
        Modal.confirm({
            title: `确定删除${title ? ' ' + title + ' ' : '这个回答吗'}?`,
            content: '答案内容不会被永久删除，你还可以撤消本次删除操作。',
            okText: '确定',
            cancelText: '取消',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return new Promise(resolve => {
                    dispatch({
                        type: 'answer/delete',
                        payload: {
                            question_id,
                            id,
                        },
                    }).then(() => {
                        resolve();
                        if (callback) callback();
                    });
                });
            },
            onCancel() {},
        });
    };

    if (!allow_delete) return null;
    return (
        <DeleteButton onClick={onDelete} {...props}>
            删除
        </DeleteButton>
    );
};
