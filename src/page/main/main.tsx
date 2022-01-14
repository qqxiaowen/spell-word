/*
 * @Author: xiaoWen
 * @Date: 2022-01-14 10:39:37
 * @LastEditors: xiaoWen
 * @LastEditTime: 2022-01-14 10:43:41
 */

import { Button, Drawer, Form, InputNumber, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import './main.less';
// import { selfAudio } from './utils';

const { Option } = Select;

interface writeBoxArrItem {
  className: string;
  value: string;
}

const Main = () => {
  const [wordBoxArr, setWordBoxArr] = useState<string[]>([]);
  const [writeBoxArr, setWriteBoxArr] = useState<writeBoxArrItem[]>([]);
  // const [resultLength] = useState<number>(20); // 一次要练习的字符长度

  const [isShowSettingDom, setIsShowSettingDom] = useState<boolean>(false); // 是否显示设置抽屉

  const [formData] = Form.useForm();

  const defaultFormData = {
    resultLength: 100,
    workType: ['middleRight']
  };
  const fiterWorkArr = ['META', 'ALT', 'CONTROL', 'SHIFT', 'CAPSLOCK', 'TAB', 'ENTER']; // 需要过滤的特殊键
  const baseWork: any = {
    // 要练习的字符映射
    middleRight: ['H', 'J', 'K', 'L', ';'],
    middleLeft: ['A', 'S', 'D', 'F', 'G'],
    topRight: ['Y', 'U', 'I', 'O', 'P'],
    topLeft: ['Q', 'W', 'E', 'R', 'T'],
    bottomRight: ['N', 'M', ',', '.', '/'],
    bottomLeft: ['Z', 'X', 'C', 'V', 'B'],
    indexFingerRightOne: ['Y', 'H', 'N'], // 右手食指1
    indexFingerRightTwo: ['U', 'J', 'M'], // 右手食指2
    indexFingerLeftOne: ['R', 'F', 'V'], // 左手食指1
    indexFingerLeftTwo: ['T', 'G', 'B'] // 左手食指2
  };
  const wordInterval = 5; // 间隔

  // const selfAudioObj = new selfAudio();

  useEffect(() => {
    formData.setFieldsValue({ ...defaultFormData });
    getWorkText();
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
  const getWorkText = () => {
    let recordObj: any = {};
    let workArr: string[] = [];
    // console.log(formData.getFieldsValue());

    (formData.getFieldValue('workType') || defaultFormData.workType).forEach((item: string) => {
      workArr = workArr.concat(baseWork[item]);
    });
    workArr = Array.from(new Set(workArr));
    // console.log('workArr: ', workArr);
    let resultArr = [];
    const forLength = formData.getFieldValue('resultLength') || defaultFormData.resultLength;
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
    console.log('recordObj: ', recordObj);
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
      console.log('练习完了', arr, wordBoxArr);
      // 练习完了
      setWriteBoxArr([]);
      getWorkText();
    } else {
      setWriteBoxArr(arr);
    }
  };

  /** 设置 */
  const settingDom = useMemo(() => {
    const hideDrawer = () => {
      formData.validateFields().then(data => {
        setIsShowSettingDom(false);
        getWorkText();
        setWriteBoxArr([]);
      });
    };
    return (
      <>
        <Button type="primary" className="setting-button" onClick={() => setIsShowSettingDom(true)}>
          设置
        </Button>
        <Drawer style={{ marginTop: 48 }} title="设置" onClose={hideDrawer} visible={isShowSettingDom} closable={false}>
          <Form form={formData}>
            <Form.Item name="resultLength" label="字符数量" rules={[{ required: true, message: '必填' }]}>
              <InputNumber min={20} max={9999} placeholder="请输入" />
            </Form.Item>
            <Form.Item name="workType" label="练习区间" rules={[{ required: true, message: '必选' }]}>
              <Select mode="multiple" placeholder="请选择">
                {Object.keys(baseWork).map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Button type="primary" onClick={hideDrawer}>
            确定
          </Button>
        </Drawer>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseWork, formData, isShowSettingDom]);

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
          {writeBoxArr.map((item: writeBoxArrItem, index: number) => (
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
