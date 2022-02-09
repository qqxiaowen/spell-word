/*
 * @Author: xiaoWen
 * @Date: 2022-01-14 10:39:37
 * @LastEditors: xiaoWen
 * @LastEditTime: 2022-02-09 14:24:42
 */

import { Button, Drawer, Form, InputNumber, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { baseWorkArr, ESelectTypeMapValue, fingerTestArr, fiterWorkArr, MapItem, selectTypeMap, tokenTestArr, wordInterval } from '../../utils/constant';

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
  }, [writeBoxArr, wordBoxArr, isShowSettingDom]);

  /** 获取随机字符 */
  const getWorkText = (type: string) => {
    let recordObj: any = {};
    let workArr: string[] = [];
    console.log(formData.getFieldsValue());

    (formData.getFieldValue('baseWork') || []).forEach((item: string) => {
      workArr = workArr.concat(item.toLocaleUpperCase().split(''));
    });
    (formData.getFieldValue('fingerTest') || []).forEach((item: string) => {
      workArr = workArr.concat(item.toLocaleUpperCase().split(''));
    });
    (formData.getFieldValue('tokenTest') || []).forEach((item: string) => {
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
    if (arr.length === wordBoxArr.length) {
      // 练习完了
      console.log('练习完了', arr, wordBoxArr);
      setWriteBoxArr([]);
      getWorkText('over');
    } else {
      setWriteBoxArr(arr);
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
              <Select mode="multiple" placeholder="请选择" onChange={val => setSelectType(val)}>
                {selectTypeMap.map((item: MapItem) => (
                  <Option value={item.value} key={item.label}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectType.includes(ESelectTypeMapValue.baseWord) && (
              <Form.Item name="baseWork" label="基础字母" rules={[{ required: true, message: '必选' }]}>
                <Select mode="multiple" placeholder="请选择">
                  {baseWorkArr.map((item: MapItem) => (
                    <Option value={item.value} key={item.label}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {selectType.includes(ESelectTypeMapValue.fingerText) && (
              <Form.Item name="fingerTest" label="手指练习" rules={[{ required: true, message: '必选' }]}>
                <Select mode="multiple" placeholder="请选择">
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
                <Select mode="multiple" placeholder="请选择">
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

  return (
    <div className="word-page">
      {settingDom}
      {writeDom}
    </div>
  );
};

export default Main;
