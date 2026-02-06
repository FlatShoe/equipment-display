import 'element-ui/lib/theme-chalk/index.css'
import {
  Progress,
  Tooltip,
  Carousel,
  CarouselItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Row,
  Col,
  Button,
  Table,
  TableColumn,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Dialog,
  Form,
  FormItem,
  Input,
  InputNumber,
  Switch,
  Cascader,
  DatePicker,
  TimeSelect,
  RadioGroup,
  Radio,
  RadioButton,
  CheckboxGroup,
  Checkbox,
  CheckboxButton,
  Select,
  Option,
  OptionGroup,
  Transfer,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Tabs,
  TabPane,
  Popover,
  Message,
  MessageBox,
  Notification,
  Tree,
  Upload,
  Image,
  Badge,
  Timeline,
  TimelineItem,
  TimePicker,
  Collapse,
  CollapseItem,
  Scrollbar,
  Skeleton,
  SkeletonItem,
  Rate,
  ButtonGroup,
  Descriptions,
  DescriptionsItem,
  Card,
  Divider,
  Slider,
  Drawer,
  Tag
} from 'element-ui'

// 显式引入Scrollbar组件

export default Vue => {
  Vue.use(OptionGroup)
  Vue.use(ButtonGroup)
  Vue.use(Divider)
  Vue.use(Slider)
  Vue.use(Scrollbar)
  Vue.use(Progress)
  Vue.use(Tooltip)
  Vue.use(Carousel)
  Vue.use(CarouselItem)
  Vue.use(Menu)
  Vue.use(Submenu)
  Vue.use(MenuItem)
  Vue.use(MenuItemGroup)
  Vue.use(Col)
  Vue.use(Row)
  Vue.use(Button)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Pagination)
  Vue.use(Breadcrumb)
  Vue.use(BreadcrumbItem)
  Vue.use(Dialog)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(InputNumber)
  Vue.use(Switch)
  Vue.use(Cascader)
  Vue.use(DatePicker)
  Vue.use(TimeSelect)
  Vue.use(RadioGroup)
  Vue.use(Radio)
  Vue.use(RadioButton)
  Vue.use(CheckboxGroup)
  Vue.use(Checkbox)
  Vue.use(CheckboxButton)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Transfer)
  Vue.use(Dropdown)
  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)
  Vue.use(Avatar)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(Popover)
  Vue.use(Tree)
  Vue.use(Upload)
  Vue.use(Image)
  Vue.use(Badge)
  Vue.use(TimePicker)
  Vue.use(TimelineItem)
  Vue.use(Timeline)
  Vue.use(Collapse)
  Vue.use(CollapseItem)
  Vue.use(Skeleton)
  Vue.use(SkeletonItem)
  Vue.use(Rate)
  Vue.use(Descriptions)
  Vue.use(DescriptionsItem)
  Vue.use(Card)
  Vue.use(Drawer)
  Vue.use(Tag)

  Vue.use(Scrollbar)

  Vue.prototype.$message = Message
  Vue.prototype.$notify = Notification

  const {confirm, alert} = MessageBox
  Vue.prototype.$confirm = confirm
  Vue.prototype.$alert = alert

  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$msgbox = MessageBox

  // 统一修改element组件得size和弹框zindex的起始数字
  Vue.prototype.$ELEMENT = {
    size: 'small',
    // zIndex: 2000
  }
}
