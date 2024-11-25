import { defineNuxtPlugin } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'
import TabMenu from 'primevue/tabmenu'
import SpeedDial from 'primevue/speeddial'
import SelectButton from 'primevue/selectbutton'
import Chart from 'primevue/chart'
import FileUpload from 'primevue/fileupload'
import Galleria from 'primevue/galleria'
import TreeSelect from 'primevue/treeselect'
import Rating from 'primevue/rating'
import Knob from 'primevue/knob'
import Timeline from 'primevue/timeline'
import Dock from 'primevue/dock'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import ColorPicker from 'primevue/colorpicker'
import Slider from 'primevue/slider'
import InputSwitch from 'primevue/inputswitch'
import Avatar from 'primevue/avatar'
import Chip from 'primevue/chip'
import OrderList from 'primevue/orderlist'
import Badge from 'primevue/badge'
import Sidebar from 'primevue/sidebar'
import PasswordMeter from 'primevue/password'
import ProgressBar from 'primevue/progressbar'
import OverlayPanel from 'primevue/overlaypanel'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import Panel from 'primevue/panel'
import PanelMenu from 'primevue/panelmenu'
import Password from 'primevue/password'
import PickList from 'primevue/picklist'
import RadioButton from 'primevue/radiobutton'
import ScrollPanel from 'primevue/scrollpanel'
import ScrollTop from 'primevue/scrolltop'
import Skeleton from 'primevue/skeleton'
import SplitButton from 'primevue/splitbutton'
import Splitter from 'primevue/splitter'
import Steps from 'primevue/steps'
import TabView from 'primevue/tabview'
import Terminal from 'primevue/terminal'
import TieredMenu from 'primevue/tieredmenu'
import ToggleButton from 'primevue/togglebutton'
import Toolbar from 'primevue/toolbar'
import Tree from 'primevue/tree'
import TreeTable from 'primevue/treetable'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true })
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.use(ConfirmationService)

    nuxtApp.vueApp.directive('tooltip', Tooltip)

    // Register PrimeVue components
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('Dialog', Dialog)
    nuxtApp.vueApp.component('Card', Card)
    nuxtApp.vueApp.component('Dropdown', Dropdown)
    nuxtApp.vueApp.component('Calendar', Calendar)
    nuxtApp.vueApp.component('Checkbox', Checkbox)
    nuxtApp.vueApp.component('DataTable', DataTable)
    nuxtApp.vueApp.component('Column', Column)
    nuxtApp.vueApp.component('Tag', Tag)
    nuxtApp.vueApp.component('Breadcrumb', Breadcrumb)
    nuxtApp.vueApp.component('TabMenu', TabMenu)
    nuxtApp.vueApp.component('SpeedDial', SpeedDial)
    nuxtApp.vueApp.component('SelectButton', SelectButton)
    nuxtApp.vueApp.component('Chart', Chart)
    nuxtApp.vueApp.component('FileUpload', FileUpload)
    nuxtApp.vueApp.component('Galleria', Galleria)
    nuxtApp.vueApp.component('TreeSelect', TreeSelect)
    nuxtApp.vueApp.component('Rating', Rating)
    nuxtApp.vueApp.component('Knob', Knob)
    nuxtApp.vueApp.component('Timeline', Timeline)
    nuxtApp.vueApp.component('Dock', Dock)
    nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
    nuxtApp.vueApp.component('ColorPicker', ColorPicker)
    nuxtApp.vueApp.component('Slider', Slider)
    nuxtApp.vueApp.component('InputSwitch', InputSwitch)
    nuxtApp.vueApp.component('Avatar', Avatar)
    nuxtApp.vueApp.component('Chip', Chip)
    nuxtApp.vueApp.component('OrderList', OrderList)
    nuxtApp.vueApp.component('Badge', Badge)
    nuxtApp.vueApp.component('Sidebar', Sidebar)
    nuxtApp.vueApp.component('Password', Password)
    nuxtApp.vueApp.component('ProgressBar', ProgressBar)
    nuxtApp.vueApp.component('OverlayPanel', OverlayPanel)
    nuxtApp.vueApp.component('Menu', Menu)
    nuxtApp.vueApp.component('Menubar', Menubar)
    nuxtApp.vueApp.component('Message', Message)
    nuxtApp.vueApp.component('MultiSelect', MultiSelect)
    nuxtApp.vueApp.component('Panel', Panel)
    nuxtApp.vueApp.component('PanelMenu', PanelMenu)
    nuxtApp.vueApp.component('PasswordMeter', PasswordMeter)
    nuxtApp.vueApp.component('PickList', PickList)
    nuxtApp.vueApp.component('RadioButton', RadioButton)
    nuxtApp.vueApp.component('ScrollPanel', ScrollPanel)
    nuxtApp.vueApp.component('ScrollTop', ScrollTop)
    nuxtApp.vueApp.component('Skeleton', Skeleton)
    nuxtApp.vueApp.component('SplitButton', SplitButton)
    nuxtApp.vueApp.component('Splitter', Splitter)
    nuxtApp.vueApp.component('Steps', Steps)
    nuxtApp.vueApp.component('TabView', TabView)
    nuxtApp.vueApp.component('Terminal', Terminal)
    nuxtApp.vueApp.component('TieredMenu', TieredMenu)
    nuxtApp.vueApp.component('ToggleButton', ToggleButton)
    nuxtApp.vueApp.component('Toolbar', Toolbar)
    nuxtApp.vueApp.component('Tree', Tree)
    nuxtApp.vueApp.component('TreeTable', TreeTable)
})
