function InsRatesC(props) {
  const eachType = (type, i) => (
    <span key={i} onClick={props.select.bind(null, type)} className={props.selectedValue === type ? "selected" : ""}>{type}，</span>
  )

  const eachDescription = (value, i) => {
    const types = value.content.split(/[，、]/);
    return <td className="rates-description" key={i} >
      <h1>{value.name}</h1>
      <div>
        {types.map(eachType)}
      </div>
    </td>
  }

  if (!props.visible) {
    return <div></div>
  }

  let values = props.values || [];
  if (typeof values !== "object") {// if not array
    values = [values];
  }
  const rows = [values.slice(0, 4), values.slice(4,8)];

  return <div className="ins-rates" >
    <div>
      <table>
        <tbody>
          <tr>
            {rows[0].map(eachDescription)}
          </tr>
          <tr>
            {rows[1].map(eachDescription)}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

export default InsRatesC;