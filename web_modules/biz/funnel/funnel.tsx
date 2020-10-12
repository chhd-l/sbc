import React from 'react';
//下面是按需加载
import echarts from 'echarts/lib/echarts';
//导入饼图
import 'echarts/lib/chart/funnel'; //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
const colors = ['#FDE9EC', '#FACFD5', '#F3939D', '#E62A3E'];
const img1 =
  'data:image/png;base64,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';
const img2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAwCAYAAABaHInAAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAANqADAAQAAAABAAAAMAAAAAB8A9sEAAAEPElEQVRoBe2aS2wNURjHlWqUelZIBQlBveKRSGyJV0K6s7CR2IgtIhEbCVtWFnYeQSKxESxtpLEgGqmm3kJJKPGoeJUG9fvfnrn5Op1753TuvZ25iS/59zzmnO/7/+d8c+bRO2qUs/7+/iZwC/wFst/gITgN5gXjqq6E/GFQyHo5sKPqRIkwxLcVUuX6f1KuqRZxNZYoxNfSFvnRoBa0gPUgsAs1NTU7g0bVlgitBfdBYF+ojKkGQVqVgsbqaAO5zoClbtBEyoXgkdocm0txEjSrnaJ1EbsNnIBztxcPyO8C1vKbCJ1n7YEM1D/AYZuE6VqKs3uhAStN+7WpZ6HaCIlLiFtQNBUd0weUv0EwdpXrV3EEvAGLwKCNiPZImeJuAEtcwPGUe129eMEZ6DBpJiGZMriNB+8Nxw6fVJQIm456QpmRJWVsGD/g88pwakgiTPPtdWb8pVPlRCsdF5jo3b7C2s0kVe11FjqUSnM+USeZyO2+wmwqan6mVgw+4RPtJ4wcfs9ke+NbLnUZsvCJ9hPmBOSeNlx9ocvrrGizK/YHUp2+qSgBj40K3Stmm3baVSvsCRnWm1SYhKT9fJg7mWTONCpzco2BP+0qql4YGuxqSdN/YToLspfgV6428CcTqQiVyBUzPOOr5HMnCKwrfkblR0Am8jl2ONeYWD4xVOfgdJxpj3iV+HUEXWwC564vtYcrzG75mqvXlTRtGcHHGgJlESZ/aQsLX1/5R79SVkzC0t5AwsLyKyZy3kZOTwPWznlPLvNASNSDp4ZMD/X8QgWv+15heVT5xOQPDJ7uJlRkxYihT3xTgZ4qwqX6FH8zsO9gl+H3l76cDUuYm6MNxEsYBBsYG0Us6LPEbd2+W7mwRYuvHD1edETcQcieAtZmBnPobAFt4C3oAyNh+taxKeAQlElWzN7L5Efp+M451DU3xdUrUfTjVKujy0GvUbeBPpJ+phxkSYTZe5mcSVir89pN6SOsj3E94JMpbT04ZvtydUTofSvWyiHM3su2EHE30E1TRIYQUx/kvlNmy8jnOqBv+oFdzRbDEtigyN4/npfgqmJT8ze0YUa4YcbPQ+h+UGf6qrOKiHUgK/YNIkfCZ1JfUBMZzo4x8UCiyZWZNJ1N6WPgOmkqav5BsBcMuYfo4AjbM+IN4pF4xQLirJz+y7ka6N84aVxnunVcsatF+78VPAOs2ARwFNwErUC/F6kvOCHhAXw2gzPgLrgGtid0FT8N53onsh9TaObsDn/Llpb4WgP0O5OwDdkN41l7jCDKvnAk097j4cJrCD6VCVH2h86mKCel7IrytyrKqevThlIuKxRH/FdEBSlV2NMop64v/HpTZGjsoWK+inGIdRw5gDRoBK8jcuQFfZMjJyXoxNfWiBjqOp3And8UnOvD6UWgt+ZucB7M8pvtPwqfG4F23i9APzc8BOw3xUHO/gGWRW8ZFJz6IgAAAABJRU5ErkJggg==';
const img3 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA2CAYAAABqbKGZAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAM6ADAAQAAAABAAAANgAAAAAH7cIoAAADoklEQVRoBe2az0tUURTHHdN+UVgujKyFi6Ii+kmgBZZJgRBt3NgP2rRr36JNuGjZHxBukjZFLiLahNCPhVj0c5NhST8gpJwwcJOFptPn1Fw983zz5t7XzOs6zIEv575zzz33e+65b+7z+aqqiiiZTGYLGADToJCkcegu4vSFQzFhLagHa6K86a8GQ8BVTkXFNX0EXQuER42xWWkG1IFLYATMACOvaTSEBcG+2Tg56pth8YyNWI3grYopfN6AbrDa+IVqHJrBGMgn58MG4rwx34AC9t6weMbG2IsR40fp22t8q01DNB1NqHtgHcgn42EdqVRqFHt/WF+ELUPf1Yh+6QqdLztmA/oBvBvlOpU1/lEY79A4rm20x8AnMAsGwQWI/0IvEMZL2eWmbgG1CxxyDWkurxDrbq4594qYS7FcBs1A+DaB4FbvI04X9r/CoA6gRUrYZvp90vA6CoK3wjxXOq8BI7M09vuUQJAL/NoM2azumfPBIL9URgbmOjxuQPaZIYx+oX8A9D585XEOmprm2aCT0TfspB7hcfuH4lajk1H2xdksq2TcnnOyBeNmO0DzEFhSwhrOEPs+58dT2zmckyGRfQSXX7skqirPYXtISN/oeXOLQ0jOnzjj8pKI6JDKy8lvJXFIybPbT6vo/+70nRAPbcM4bzNKPkzpdzBBqSsk98wg830sWTISmAneoQReSZxt5lUCmkwlGb0aPrUrlfGpGppLWVXG+ZzhjFnGalwH7aCUiyHvHPrBGY6CaXRBcU6GiCdAZ8HIxXGQlxS3QJ9NuDgrKyuWpFjPF6cy8gayAyS1zW7brpxzMuzfKYKftp0gSb842yxJfk5zVZJxWq4EnSuVSXCxnaYqq8o4/zTLUvFIswm1+P9sJpFtJPISLAellknm28nZ9t5mojjb7AiBk0hE+K8Eh6VhI3GSeUxg6+clGxIRPvKG5klEf06X8z1DyZ9T+laiJPV61uptpmTlnIwMIqFHKIFXEmebeZWAJlNJRq+GT+2yrYz80WVklWl4rjXPKV0Z+WLCyG7T8FzvUvzSOhl9OMnHQO3K0bsm/I5BSicz/+9COoNfPHzD1glinUWlyh4+8v1bF5gARuSLkpbgh0Dycu9kgIh8E/A5YPufl/Il04oAgV4O8rPBZNbjNATqA84+X36F3HaSGdf3jDymfKHjIPjgM3vFbYR2qyQitpzKGCf2nzzinwPyenQrqAO+yAREhsEN0EMic0fKbz7vqT4DsBSVAAAAAElFTkSuQmCC';
const img4 =
  'data:image/png;base64,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';

export default class Line extends React.Component {
  constructor(props, ctx) {
    super(props);
  }
  componentDidMount() {}
  getOption = () => {
    const { data } = this.props as any;
    let option = {
      color: colors,
      legendHoverLink: false,
      hoverAnimation: false, //鼠标悬浮是否有区域弹出动画，false:无  true:有
      avoidLabelOverlap: false,
      series: [
        {
          type: 'funnel',
          top: '0%',
          left: '29%',
          width: '40%',
          height: '80%',

          labelLine: {
            show: false,
            normal: {
              show: false
            }
          },
          label: {
            show: false
          },
          itemStyle: {
            show: false,
            normal: {
              opacity: 0.8
            }
          },
          data: [{ value: 100 }, { value: 75 }, { value: 50 }, { value: 25 }]
        },
        {
          type: 'funnel',
          top: '0%',
          left: '34%',
          width: '30%',
          height: '80%',
          itemStyle: {
            show: false,
            normal: {
              opacity: 0.8
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          label: {
            show: false,
            normal: {
              position: 'inside'
              /*formatter: function(e){
                console.log(e);

                return (<div>111111111</div>)
              },*/
            }
            /*emphasis: {
              formatter: '{b}: {c}({d}%)'
            }*/
          },
          data: data
        }
      ]
    };
    return option;
  };

  render() {
    return (
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '47.5%', top: '6.2%', zIndex: 999 }}>
          <img src={img1} alt="" width="30%" />
        </div>
        <div style={{ position: 'absolute', left: '47.5%', top: '25.6%', zIndex: 999 }}>
          <img src={img2} alt="" width="30%" />
        </div>
        <div style={{ position: 'absolute', left: '47.5%', top: '45.5%', zIndex: 999 }}>
          <img src={img3} alt="" width="30%" />
        </div>
        <div style={{ position: 'absolute', left: '47.5%', top: '63%', zIndex: 999 }}>
          <img src={img4} alt="" width="30%" />
        </div>
        <ReactEcharts option={this.getOption()} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}
