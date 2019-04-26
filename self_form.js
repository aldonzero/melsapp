<FormItem label='结款编号' {...formItemLayout}>
 {
 formInfo && type == 'billNo' ? formInfo.billNo :
 getFieldDecorator('billNo', {
 initialValue: formInfo.billNo,
 rules: [
 {
 required: true,
 message: '结款编号不能为空'
 }
 ]
 })(
 <Input placeholder='请输入结款编号' />
 )
 }
 </FormItem>

<FormItem label='项目' {...formItemLayout}>
 {
 formInfo && type == 'projectId' ? formInfo.projectId :
 getFieldDecorator('projectId', {
 initialValue: formInfo.projectId,
 rules: [
 {
 required: true,
 message: '项目不能为空'
 }
 ]
 })(
 <Input placeholder='请输入项目' />
 )
 }
 </FormItem>

<FormItem label='名称' {...formItemLayout}>
 {
 formInfo && type == 'quantities' ? formInfo.quantities :
 getFieldDecorator('quantities', {
 initialValue: formInfo.quantities,
 rules: [
 {
 required: true,
 message: '名称不能为空'
 }
 ]
 })(
 <Input placeholder='请输入名称' />
 )
 }
 </FormItem>

<FormItem label='单价' {...formItemLayout}>
 {
 formInfo && type == 'price' ? formInfo.price :
 getFieldDecorator('price', {
 initialValue: formInfo.price,
 rules: [
 {
 required: true,
 message: '单价不能为空'
 }
 ]
 })(
 <Input placeholder='请输入单价' />
 )
 }
 </FormItem>

<FormItem label='经办人' {...formItemLayout}>
 {
 formInfo && type == 'agent' ? formInfo.agent :
 getFieldDecorator('agent', {
 initialValue: formInfo.agent,
 rules: [
 {
 required: true,
 message: '经办人不能为空'
 }
 ]
 })(
 <Input placeholder='请输入经办人' />
 )
 }
 </FormItem>

<FormItem label='状态' {...formItemLayout}>
 {
 formInfo && type == 'state' ? formInfo.state :
 getFieldDecorator('state', {
 initialValue: formInfo.state,
 rules: [
 {
 required: true,
 message: '状态不能为空'
 }
 ]
 })(
 <Input placeholder='请输入状态' />
 )
 }
 </FormItem>

<FormItem label='备注' {...formItemLayout}>
 {
 formInfo && type == 'remark' ? formInfo.remark :
 getFieldDecorator('remark', {
 initialValue: formInfo.remark,
 rules: [
 {
 required: true,
 message: '备注不能为空'
 }
 ]
 })(
 <Input placeholder='请输入备注' />
 )
 }
 </FormItem>

