const states = {
  
  Albania: 0.005,
  Armenia: 0.241,
  Austria: 0.243,
  Azerbaijan: 0.597,
  Belanda: 0.329,
  Belgia: 0.169,
  Bosnia: 1.345,
  Bulgaria: 0.505,
  Ceko: 0.544,
  Denmark: 0.103,
  Estonia: 0.249,
  Finlandia: 0.057,
  Georgia: 0.106,
  Herzegovina: 1.345,
  Hungaria: 0.220,
  Indonesia: 0.731,
  Inggris: 0.405,
  Irlandia: 0.347,
  Islandia: 0.001,
  Italia: 0.284,
  Jerman: 0.382,
  Kazakhstan: 0.947,
  Kirgizstan: 0.064,
  Kosovo: 1.310,
  Kroasia: 0.376,
  Latvia: 0.301,
  Lituania: 0.078,
  Luksemburg: 0.285,
  "Makedonia Utara": 0.545,
  Malta: 0.356,
  Moldova: 0.595,
  Montenegro: 0.564,
  Norwegia: 0.012,
  Polandia: 0.776,
  Portugal: 0.179,
  Prancis: 0.068,
  Rumania: 0.377,
  Serbia: 1.017,
  Siprus: 0.660,
  Slovakia: 0.352,
  Slovenia: 0.203,
  Spanyol: 0.174,
  Swedia: 0.014,
  Tajikistan: 0.095,
  Turki: 0.485,
  Turkmenistan: 1.262,
  Ukraina: 0.430,
  Uzbekistan: 0.594,
  Yunani: 0.411,

  };
  
  const emissionFactor = {
    electricity: states,
    fuel: 2.32,
    lpg: 1.8,
    waste: 0.44,
  };
  const usage = {};
  
  const emission = {};
  
  const select_state = document.getElementById("select-state");
  const form_container = document.getElementById("form-container")
  const result_container = document.getElementById("result-container");
  const result_output = document.getElementById("result-output")
  const success = document.getElementById("success");
  const danger = document.getElementById("danger");
  const electricity_output = document.getElementById("electricity-output");
  const electricity_result = document.getElementById("electricity-result");
  const fuel_output = document.getElementById("fuel-output");
  const fuel_result = document.getElementById("fuel-result");
  const lpg_output = document.getElementById("lpg-output");
  const lpg_result = document.getElementById("lpg-result");
  const waste_output = document.getElementById("waste-output");
  const waste_result = document.getElementById("waste-result");
  const members_input = document.getElementById("members-input");
  let state_input = 0;
  let totalEmission =0 ;
  
  //adding opptions to the select-state using js
  for (const state in states) {
    let newOption = new Option(state, state);
    select_state.add(newOption, undefined);
  }
  
  //onclcick
  function onSubmition() {
    store();
    calculate();
    display()
  }
  
  // storing values selected by user in object
  function store() {
    usage.electricity = document.getElementById("electricity-input").value * 12;
  
    usage.fuel =
      (document.getElementById("distance-input").value /
        document.getElementById("mileage-input").value) *
      365;
  
    usage.lpg = document.getElementById("lpg-input").value * 24;
  
    usage.waste = document.getElementById("waste-input").value * 52;
  
    state_input = select_state.options[select_state.selectedIndex].value;
  
    //    for (const use in usage) {
    //     console.log(`${use} : ${usage[use]}`);
    //   }
    //    console.log(state_input)
  }
  
  //calculating emission
  function calculate() {
      console.log(state_input)
    emission.electricity = usage.electricity * states[state_input];
  
    emission.fuel = usage.fuel * emissionFactor["fuel"];
  
    emission.lpg = usage.lpg * emissionFactor["lpg"];
  
    emission.waste = usage.waste * emissionFactor["waste"];
  
    for(const emit in emission){
        totalEmission += emission[emit] / members_input.value 
    }
  }
  
  
  //display
  function display(){
      result_container.style.display = "block"
      form_container.style.display = "none"
  
      result_output.innerText = Math.round((totalEmission/1000) * 100) / 100 
      electricity_result.innerText =  Math.round((emission.electricity/members_input.value) * 100) / 100
      fuel_result.innerText = Math.round((emission.fuel/members_input.value) * 100) / 100
      lpg_result.innerText = Math.round((emission.lpg/members_input.value)* 100) / 100
      waste_result.innerText = Math.round((emission.waste/members_input.value)* 100) / 100
      if(totalEmission<=2000){
          success.style.display = "block"
      }
      else{
          danger.style.display = "block"
          if ((emission.electricity / members_input.value  )<= 1100 ? false:true) {
             electricity_output.style.display = "block"
            }
            if ((emission.fuel / members_input.value ) <= 400 ? false:true) {
              fuel_output.style.display = "block"
            }
            if ((emission.lpg / members_input.value ) <= 100 ? false:true) {
              lpg_output.style.display = "block"
            }
            if ((emission.waste / members_input.value ) <= 400 ? false:true) {
              waste_output.style.display = "block"
              
            }
      }
  
  }