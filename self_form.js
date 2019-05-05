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

<FormItem label='设备编号' {...formItemLayout}>
 {
 formInfo && type == 'machineryId' ? formInfo.machineryId :
 getFieldDecorator('machineryId', {
 initialValue: formInfo.machineryId,
 rules: [
 {
 required: true,
 message: '设备编号不能为空'
 }
 ]
 })(
 <Input placeholder='请输入设备编号' />
 )
 }
 </FormItem>

<FormItem label='工时' {...formItemLayout}>
 {
 formInfo && type == 'workingHour' ? formInfo.workingHour :
 getFieldDecorator('workingHour', {
 initialValue: formInfo.workingHour,
 rules: [
 {
 required: true,
 message: '工时不能为空'
 }
 ]
 })(
 <Input placeholder='请输入工时' />
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

<FormItem label='工作日期' {...formItemLayout}>
 {
 formInfo && type == 'workingDate' ? formInfo.workingDate :
 getFieldDecorator('workingDate', {
 initialValue: formInfo.workingDate,
 rules: [
 {
 required: true,
 message: '工作日期不能为空'
 }
 ]
 })(
 <Input placeholder='请输入工作日期' />
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

