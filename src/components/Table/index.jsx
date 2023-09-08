const Table = ({ models, deleteById }) => {
  if (models.length === 0) return null
  const ths = Object.keys(models[0])
  ths.sort((a, b) => a.length - b.length)

  return <div className="overflow-auto"><table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {
          ths.map((th) => {
            return <th scope="col" className="px-6 py-3" key={th}>
              {th}
            </th>
          })
        }
        <th className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
    {
      models.map((model, index) =>
       <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          {
            ths.map((th, index) => {
              return <td key={th + index} className="px-6 py-4">
                {model[th]}
              </td>
            })
          }
          <td className="px-6 py-4">
            <span onClick={() => deleteById(model.id)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</span>
          </td>
       </tr>
      )
    }
    </tbody>
  </table>
  </div>
}

export default Table