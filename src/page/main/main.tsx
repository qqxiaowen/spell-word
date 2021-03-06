/*
 * @Author: xiaoWen
 * @Date: 2022-01-14 10:39:37
 * @LastEditors: xiaoWen
 * @LastEditTime: 2022-02-22 09:56:30
 */

import { Button, Drawer, Form, InputNumber, message, Modal, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
  baseWorkArr,
  ESelectTypeMapValue,
  fingerTestArr,
  fiterWorkArr,
  MapItem,
  selectTypeMap,
  tokenTestArr,
  wordInterval
} from '../../utils/constant';

import './main.less';
// import { selfAudio } from './utils';

const { Option } = Select;

interface WriteBoxArrItem {
  className: string;
  value: string;
}

const Main = () => {
  const [wordBoxArr, setWordBoxArr] = useState<string[]>([]);
  const [writeBoxArr, setWriteBoxArr] = useState<WriteBoxArrItem[]>([]);

  const [isShowSettingDom, setIsShowSettingDom] = useState<boolean>(true); // 是否显示设置抽屉
  const [isShowfinishModal, setIsShowfinishModal] = useState<boolean>(false); // 是否显示已联系完毕modal
  const [selectType, setSelectType] = useState<ESelectTypeMapValue[]>([]); // 类型选择

  const [formData] = Form.useForm();

  // const selfAudioObj = new selfAudio();

  useEffect(() => {
    // getWorkText('init');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isShowSettingDom) return;

    window.addEventListener('keydown', listenUserKeyDow);
    return () => {
      window.removeEventListener('keydown', listenUserKeyDow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeBoxArr, wordBoxArr, isShowSettingDom, isShowfinishModal]);

  /** 获取随机字符 */
  const getWorkText = (type: string) => {
    let recordObj: any = {};
    let workArr: string[] = [];
    console.log(formData.getFieldsValue());

    (formData.getFieldValue(ESelectTypeMapValue.baseWord) || []).forEach((item: string) => {
      workArr = workArr.concat(item.toLocaleUpperCase().split(''));
    });
    (formData.getFieldValue(ESelectTypeMapValue.fingerText) || []).forEach((item: string) => {
      workArr = workArr.concat(item.toLocaleUpperCase().split(''));
    });
    (formData.getFieldValue(ESelectTypeMapValue.tokenTest) || []).forEach((item: string) => {
      workArr = workArr.concat(item.toLocaleUpperCase().split(''));
    });

    workArr = Array.from(new Set(workArr));
    // console.log('workArr: ', workArr);
    // console.log('join-type: ', type);
    let resultArr = [];
    const forLength = formData.getFieldValue('resultLength');
    for (let i = 0; i < forLength; i++) {
      let str = workArr[Math.floor(Math.random() * workArr.length)];
      resultArr.push(str);
      // console.log(i);
      if ((i + 1) % wordInterval === 0) {
        resultArr.push(' ');
      }

      // 记录次数
      if (recordObj[str]) {
        recordObj[str] += 1;
      } else {
        recordObj[str] = 1;
      }
    }
    // console.log('resultArr: ', resultArr);
    // console.log('recordObj: ', recordObj);
    setWordBoxArr(resultArr);
  };

  /** 监听用户输入 */
  const listenUserKeyDow = (e: { key: string }) => {
    if (isShowSettingDom) return;
    if (isShowfinishModal) return;
    if (writeBoxArr.length >= wordBoxArr.length) return;
    let work = e.key.toLocaleUpperCase();
    if (fiterWorkArr.includes(work)) {
      return;
    }

    let arr = [...writeBoxArr];
    // console.log(arr, writeBoxArr,wordBoxArr, wordBoxArr[arr.length], work);
    if (work === 'BACKSPACE') {
      // 删除键删除输入的单词
      arr.pop();
    } else {
      if (wordBoxArr[arr.length] === work) {
        arr.push({ className: 'success', value: work });
        // selfAudioObj.successSay();
      } else {
        arr.push({ className: 'error', value: work });
        // selfAudioObj.errorSay();
      }
    }
    setWriteBoxArr(arr);

    if (arr.length + 1 === wordBoxArr.length) {
      // 练习完了
      setIsShowfinishModal(true);
      // console.log('练习完了', arr, wordBoxArr);
    }
  };

  /** 设置 */
  const settingDom = useMemo(() => {
    const hideDrawer = () => {
      console.log('hideDrawer触发');
      if (isShowSettingDom) {
        // 收起时直接拍空格有时会触发Button-Click事件，点击page后则不会再触发
        formData.validateFields().then(data => {
          setIsShowSettingDom(false);
          getWorkText('setting');
          setWriteBoxArr([]);
        });
      }
    };

    const handleChangeType = (valArr: ESelectTypeMapValue[]) => {
      if (selectType.length > valArr.length) {
        // 取消某个类型

        // 元素多的数组转为obj，通过obj去提取交集元素。   arr删除因为删除中下标变化，导致数据有时会出问题
        let selectTypeObj: any = {};
        selectType.forEach(item => (selectTypeObj[item] = true));
        valArr.forEach(item => {
          if (selectTypeObj[item]) delete selectTypeObj[item];
        });
        // console.log('selectTypeObj: ', selectTypeObj, Object.keys(selectTypeObj));

        // 将true置为undefined
        for (let key in selectTypeObj) {
          selectTypeObj[key] = undefined;
        }

        formData.setFieldsValue(selectTypeObj);
      }
      setSelectType(valArr);
    };

    const selectChange = (valArr: string[], formName: ESelectTypeMapValue, optionArr: MapItem[]) => {
      if (valArr.includes('')) {
        let reultArr: any = undefined; // 全不选
        if (valArr.length - 1 < optionArr.length) {
          // 全选
          reultArr = Array.from(new Set([...valArr.filter(item => item), ...optionArr.map(item => item.value)]));
        }
        const obj: any = {};
        // 合并数组并去重，不改变选择的顺序
        // console.log(reultArr);
        obj[formName] = reultArr;
        formData.setFieldsValue(obj);
      }
    };

    return (
      <>
        <Button type="primary" className="setting-button" onClick={() => setIsShowSettingDom(true)}>
          设置
        </Button>
        <Drawer style={{ marginTop: 48 }} title="设置" onClose={hideDrawer} visible={isShowSettingDom} closable={false}>
          <Form form={formData}>
            <Form.Item name="resultLength" label="字符数量" rules={[{ required: true, message: '必填' }]} initialValue={120}>
              <InputNumber min={20} max={9999} placeholder="请输入" />
            </Form.Item>
            <Form.Item name="selectType" label="类型选择" rules={[{ required: true, message: '必选' }]}>
              <Select mode="multiple" placeholder="请选择" onChange={handleChangeType}>
                {selectTypeMap.map((item: MapItem) => (
                  <Option value={item.value} key={item.label}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectType.includes(ESelectTypeMapValue.baseWord) && (
              <Form.Item name={ESelectTypeMapValue.baseWord} label="基础字母" rules={[{ required: true, message: '必选' }]}>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  onChange={valArr => selectChange(valArr, ESelectTypeMapValue.baseWord, baseWorkArr)}
                >
                  <Option value="">全选</Option>
                  {baseWorkArr.map((item: MapItem) => (
                    <Option value={item.value} key={item.label}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {selectType.includes(ESelectTypeMapValue.fingerText) && (
              <Form.Item name="fingerText" label="手指练习" rules={[{ required: true, message: '必选' }]}>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  onChange={valArr => selectChange(valArr, ESelectTypeMapValue.fingerText, fingerTestArr)}
                >
                  <Option value="">全选</Option>
                  {fingerTestArr.map((item: MapItem) => (
                    <Option value={item.value} key={item.label}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {selectType.includes(ESelectTypeMapValue.tokenTest) && (
              <Form.Item name="tokenTest" label="符号练习" rules={[{ required: true, message: '必选' }]}>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  onChange={valArr => selectChange(valArr, ESelectTypeMapValue.tokenTest, tokenTestArr)}
                >
                  <Option value="">全选</Option>
                  {tokenTestArr.map((item: MapItem) => (
                    <Option value={item.value} key={item.label}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
          <Button type="primary" onClick={hideDrawer}>
            确定
          </Button>
        </Drawer>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseWorkArr, formData, isShowSettingDom, selectType]);

  const writeDom = useMemo(() => {
    return (
      <div className="word-main" style={{ width: 34 * (5 + 1) * 6 + 'px' }}>
        <div className="word-box">
          {wordBoxArr.map((item: any, index: number) => (
            <div className="item" key={index}>
              {item}
            </div>
          ))}
        </div>
        <div className="write-box">
          {writeBoxArr.map((item: WriteBoxArrItem, index: number) => (
            <div className={`item ${item.className}`} key={index}>
              {item.value}
            </div>
          ))}
        </div>
      </div>
    );
  }, [wordBoxArr, writeBoxArr]);

  const finishModal = useMemo(() => {
    const hideModal = () => {
      setIsShowfinishModal(false);
      setTimeout(() => {
        setWriteBoxArr([]);
        getWorkText('over');
      }, 500);
    };
    return (
      <Modal
        title="练习完毕"
        closable={false}
        visible={isShowfinishModal}
        onCancel={hideModal}
        footer={
          <div className="button-box">
            <Button onClick={hideModal}>确定</Button>
          </div>
        }
      >
        <div className="finish-modal">
          {/* <div className="item">
            <span>时间：</span>
            <span>30s</span>
          </div>
          <div className="item">
            <span>速度：</span>
            <span>100字/s</span>
          </div>
          <div className="item">
            <span>正确率：</span>
            <span>200%</span>
          </div> */}
        </div>
      </Modal>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowfinishModal]);

  return (
    <div className="word-page">
      {settingDom}
      {writeDom}
      {finishModal}
    </div>
  );
};

export default Main;
