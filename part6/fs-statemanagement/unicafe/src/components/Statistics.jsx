import { useValues } from "./store"

const Statistics = () => {
  const {good, neutral, bad} = useValues()
  const all = good + neutral + bad
  const avgTemp = ((good*1)+(neutral*0)+(bad*-1))/all
  const average = Number.isNaN(avgTemp) ? 0 : Number(avgTemp.toFixed(2))
  const positiveTemp = (good/all)*100
  const positive = `${Number.isNaN(positiveTemp) ? 0 : Number((positiveTemp).toFixed(1))} %`
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
