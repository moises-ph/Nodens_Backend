type TemplateApplicationType = {
  applicant_name: string
  title: string
  enterprise_name: string
  organizer_name: string
}
export const templateForApplication = ({applicant_name, title, enterprise_name, organizer_name}: TemplateApplicationType) => 
`<div style="background-color: #000022; border-radius: 10px; color: white; padding: 8px">
  <div style="display: flex; flex-direction: row; justify-content: space-between;  width: 100%; align-items: center">
    <h2>NODENS</h2>
    <h3>${applicant_name}</h3>
  </div>
  <div>
    <h1>A aplicado correctamente a ${title}</h1>
    <div>
      <p style="font-weight: 400;">${enterprise_name}</p>
      <p style="font-weight: 100;">${organizer_name}</p>
    </div>
  </div>
</div>`;