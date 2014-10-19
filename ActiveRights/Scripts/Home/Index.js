var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
$(function () {
    $("#tree").dynatree({
        children: [
            {
                title: "C:\\", isFolder: true, key: "C:\\",
                isLazy: true
            }
        ],
        onLazyRead: function (node) {
            node.appendAjax({
                url: "/api/directory",
                data: {
                    unc: node.data.key
                }
            });
        },
        onClick: function (node) {
            ShowAcl(node.data.key);
            return true;
        },
        clickFolderMode: 1
    });
});

var AccessRule = (function (_super) {
    __extends(AccessRule, _super);
    function AccessRule(attributes, options) {
        attributes.FileSystemRights = GenericAccessRights.expand(attributes.FileSystemRights);

        _super.call(this, attributes, options);
    }
    AccessRule.prototype.getApplyOnto = function () {
        return {
            ThisFolder: !(this.attributes.PropagationFlags & 2 /* InheritOnly */),
            Subfolder: Boolean(this.attributes.InheritanceFlags & 1 /* ContainerInherit */),
            File: Boolean(this.attributes.InheritanceFlags & 2 /* ObjectInherit */)
        };
    };

    AccessRule.prototype.getFileSystemRightsString = function () {
        return (new FileSystemRights(this.get("FileSystemRights"))).toString();
    };
    return AccessRule;
})(Backbone.Model);

var AccessRules = (function (_super) {
    __extends(AccessRules, _super);
    function AccessRules() {
        _super.apply(this, arguments);
    }
    return AccessRules;
})(Backbone.Collection);

// 概要:
//     アクセス規則と監査規則の作成時に使用するアクセス権を定義します。
var FileSystemRights = (function () {
    function FileSystemRights(mask) {
        this.mask = mask;
    }
    FileSystemRights.prototype.toString = function () {
        var _this = this;
        var ret = [];

        ["FullControl", "Modify", "Write", "ReadAndExecute", "Read", "ReadData", "CreateDirectories", "CreateFiles"].forEach(function (name) {
            if ((_this.mask & FileSystemRights[name]) === FileSystemRights[name]) {
                ret.push(name);
            }
            ;
        });

        if (ret.length > 0)
            return ret.join(",");
        else
            return "";
    };

    FileSystemRights.ListDirectory = 1;

    FileSystemRights.ReadData = 1;

    FileSystemRights.CreateFiles = 2;

    FileSystemRights.WriteData = 2;

    FileSystemRights.CreateDirectories = 4;

    FileSystemRights.AppendData = 4;

    FileSystemRights.ReadExtendedAttributes = 8;

    FileSystemRights.WriteExtendedAttributes = 16;

    FileSystemRights.ExecuteFile = 32;

    FileSystemRights.Traverse = 32;

    FileSystemRights.DeleteSubdirectoriesAndFiles = 64;

    FileSystemRights.ReadAttributes = 128;

    FileSystemRights.WriteAttributes = 256;

    FileSystemRights.Write = 278;

    FileSystemRights.Delete = 65536;

    FileSystemRights.ReadPermissions = 131072;

    FileSystemRights.Read = 131209;

    FileSystemRights.ReadAndExecute = 131241;

    FileSystemRights.Modify = 197055;

    FileSystemRights.ChangePermissions = 262144;

    FileSystemRights.TakeOwnership = 524288;

    FileSystemRights.Synchronize = 1048576;

    FileSystemRights.FullControl = 2032127;
    return FileSystemRights;
})();

var GenericAccessRights = (function () {
    function GenericAccessRights(flag, standard) {
        this.flag = flag | 0;
        this.standard = standard;
    }
    GenericAccessRights.expand = function (mask) {
        [this.All, this.Execute, this.Write, this.Read].forEach(function (val) {
            if ((mask & val.flag) === val.flag) {
                mask &= (~val.flag);
                mask |= val.standard;
            }
        });
        return mask;
    };
    GenericAccessRights.All = new GenericAccessRights(parseInt("10000000", 16), FileSystemRights.FullControl);
    GenericAccessRights.Execute = new GenericAccessRights(parseInt("20000000", 16), FileSystemRights.ExecuteFile);
    GenericAccessRights.Write = new GenericAccessRights(parseInt("40000000", 16), FileSystemRights.Write);
    GenericAccessRights.Read = new GenericAccessRights(parseInt("80000000", 16), FileSystemRights.Read);
    return GenericAccessRights;
})();
;

var WinApi;
(function (WinApi) {
    (function (PropagationFlags) {
        // 概要:
        //     継承フラグが設定されていないことを指定します。
        PropagationFlags[PropagationFlags["None"] = 0] = "None";

        //
        // 概要:
        //     ACE を子オブジェクトに反映させないことを指定します。
        PropagationFlags[PropagationFlags["NoPropagateInherit"] = 1] = "NoPropagateInherit";

        //
        // 概要:
        //     ACE を子オブジェクトだけに反映させることを指定します。 この操作には、子コンテナー オブジェクトと子リーフ オブジェクトの両方が含まれます。
        PropagationFlags[PropagationFlags["InheritOnly"] = 2] = "InheritOnly";
    })(WinApi.PropagationFlags || (WinApi.PropagationFlags = {}));
    var PropagationFlags = WinApi.PropagationFlags;

    /** 概要:継承フラグでは、アクセス制御エントリ (ACE: Access Control Entry) の継承のセマンティクスを指定します。*/
    (function (InheritanceFlags) {
        /** 概要:ACE は、子オブジェクトによって継承されません。 */
        InheritanceFlags[InheritanceFlags["None"] = 0] = "None";

        /** 概要:ACE は、子コンテナー オブジェクトによって継承されます。 */
        InheritanceFlags[InheritanceFlags["ContainerInherit"] = 1] = "ContainerInherit";

        /** 概要:ACE は、子リーフ オブジェクトによって継承されます。 */
        InheritanceFlags[InheritanceFlags["ObjectInherit"] = 2] = "ObjectInherit";
    })(WinApi.InheritanceFlags || (WinApi.InheritanceFlags = {}));
    var InheritanceFlags = WinApi.InheritanceFlags;
})(WinApi || (WinApi = {}));

var AccessRuleView = (function (_super) {
    __extends(AccessRuleView, _super);
    function AccessRuleView(options) {
        var _this = this;
        this.tagName = "tr";
        this.template = _.template($("#access_rule_template").html());
        this.events = {
            "click": function () {
                console.log(_this);
            }
        };
        _super.call(this, options);
    }
    AccessRuleView.prototype.render = function () {
        var _this = this;
        this.$el.html(this.template($.extend({}, this.model.toJSON()))).addClass(this.model.attributes.IsInherited ? "inherited" : "unique");

        var applyOnto = this.model.getApplyOnto();
        $.each(applyOnto, function (idx, val) {
            _this.$el.toggleClass(idx, val);
        });

        return this;
    };
    return AccessRuleView;
})(Backbone.View);

var ACE = (function (_super) {
    __extends(ACE, _super);
    function ACE() {
        _super.apply(this, arguments);
    }
    return ACE;
})(Backbone.Model);

function ShowAcl(unc) {
    var $aclTree = $("#acltree"), $tbody = $aclTree.find("tbody");

    var securityRequest = $.ajax("/api/directorysecurity", {
        data: {
            unc: unc
        }
    });

    $tbody.empty();
    securityRequest.done(function (data) {
        data.AccessRules.forEach(function (rule) {
            var view = new AccessRuleView({
                model: new AccessRule(rule)
            });

            $tbody.append(view.render().$el);
            return;
        });
    });
}

setTimeout(function () {
    ShowAcl("C:\\");
}, 100);
//# sourceMappingURL=Index.js.map
