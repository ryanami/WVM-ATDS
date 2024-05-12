/*
 * @Author: kasuie
 * @Date: 2024-05-06 15:29:16
 * @LastEditors: kasuie
 * @LastEditTime: 2024-05-08 10:57:57
 * @Description:
 */
import { analyzeLog } from '@/lib/detect'
import { defineComponent, onMounted, ref } from 'vue'
import request from '@/lib/fetch'
import LogView from '@/components/log/LogView.vue'

export default defineComponent({
  setup() {
    const result = ref()
    const logs = ref()
    const statistic = ref([
      { text: 'DDOS攻击', value: 0 },
      { text: '端口扫描', value: 0 },
      { text: 'Webshell攻击', value: 0 },
      { text: '蚁剑payload', value: 0 },
      { text: '冰蝎payload', value: 0 },
      { text: 'SQL 注入攻击', value: 0 }
    ])

    const getData = () => {
      const res1 = request.get('/spi/nginx-log', {}, { text: true })
      const res2 = request.get('/spi/error-log', {}, { text: true })
      const res3 = request.get('/spi/8088-log', {}, { text: true })
      const res4 = request.get('/spi/8088-error-log', {}, { text: true })
      return Promise.all([res1, res2, res3, res4])
    }

    onMounted(async () => {
      const data = await getData()
      const { ipRequest, logs: log } = analyzeLog(data)
      ipRequest.map((v: any) => {
        ++statistic.value[v.type - 1].value
      })
      result.value = ipRequest
      logs.value = log
    })

    return () => (
      <div class="w-full h-full">
        <div class="flex gap-24 mb-8">
          {statistic.value.map((v: any) => {
            return <a-statistic title={v.text} value={v.value} />
          })}
        </div>
        <LogView value={logs.value} />
      </div>
    )
  }
})
