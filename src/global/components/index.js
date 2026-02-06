import './borderCardsComponent'
import './intpusComponent'
import Vue from 'vue'
import PageCard from '@/components/PageCard.vue'
import Pagination from '@/components/Pagination.vue'
import LeftRightPage from '@/components/LeftRightPage.vue'
import Empty from '@/components/Empty.vue'
import DataTable from '@/components/DataTable.vue'
import DataTableExpand from '@/components/DataTableExpand.vue'
import Chart from '@/components/charts'
import FlexoTree from '@/components/trees/FlexoTree.vue'
import CImg from '@/components/CImg.vue'
import UploadImage from '@/components/upload/upload-image/UploadImage.vue'
import UploadImages from '@/components/upload/upload-image/UploadImages.vue'
import UploadFile from '@/components/upload/UploadFile.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import FormDialog from '@/components/FormDialog.vue'
import FileView from '@/components/FileView.vue'
import FileViewDialog from '@/components/FileViewDialog.vue'
import CForm from '@/components/CForm.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

Vue.component(SvgIcon.name, SvgIcon)
Vue.component(PageCard.name, PageCard)
Vue.component(DataTableExpand.name, DataTableExpand)
Vue.component(Pagination.name, Pagination)
Vue.component(LeftRightPage.name, LeftRightPage)
Vue.component(Empty.name, Empty)
Vue.component(DataTable.name, DataTable)
Vue.component(Chart.name, Chart)
Vue.component(FlexoTree.name, FlexoTree)
Vue.component(CImg.name, CImg)
Vue.component(UploadImage.name, UploadImage)
Vue.component(UploadImages.name, UploadImages)
Vue.component(UploadFile.name, UploadFile)
Vue.component(ImageViewer.name, ImageViewer)
Vue.component(FormDialog.name, FormDialog)
Vue.component(FileView.name, FileView)
Vue.component(FileViewDialog.name, FileViewDialog)
Vue.component(CForm.name, CForm)
