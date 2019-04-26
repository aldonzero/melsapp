#!/usr/bin/env bash
pro_path=$(pwd)
echo ${pro_path}
java_path=${pro_path}"/src/main/java/"
file_name="self_form.js"

create_file(){
    file=$1
    if [ ! -f $file ];then
        echo "创建新${file}文件"
    else
         echo "删除原有文件,创建新${file}文件"
    rm -f ${file}
    touch ${file}
    fi
}

create_file $file_name

echo_form(){
form_content="  <FormItem label='${2}' {...formItemLayout}>\n
                            {\n
                                formInfo && type == '${1}' ? formInfo.${1} :\n
                                    getFieldDecorator('${1}', {\n
                                        initialValue: formInfo.${1},\n
                                        rules: [\n
                                            {\n
                                                required: true,\n
                                                message: '${2}不能为空'\n
                                            }\n
                                        ]\n
                                    })(\n
                                        <Input placeholder='请输入${2}' />\n
                                    )\n
                            }\n
                        </FormItem>\n";
echo -e $form_content>>${file_name}
}

echo_form "billNo" "结款编号"
echo_form "projectId" "项目"
echo_form "quantities" "名称"
echo_form "price" "单价"
echo_form "agent" "经办人"
echo_form "state" "状态"
echo_form "remark" "备注"