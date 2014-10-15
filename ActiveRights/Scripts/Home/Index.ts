﻿$(() => {
    $("#tree").dynatree({
        children: [
            {
                title: "C:\\", isFolder: true, key: "C:\\",
                isLazy: true
            },
            {
                title: "Folder 2", isFolder: true, key: "folder2",
                children: [
                    { title: "Sub-item 2.1" },
                    { title: "Sub-item 2.2" }
                ]
            },
            { title: "Item 3" }
        ],
        onLazyRead: (node) => {
            node.appendAjax({
                url: "/api/directory",
                data: {
                    unc: node.data.key,
                }
            });
        },
        onClick: (node) => {
            ShowAcl(node.data.key);
        },
        clickFolderMode: false
    });

    $('.tree').treegrid();
});

interface DirectorySecurity {
    AreAccessRulesProtected: boolean;
    AreAuditRulesProtected: boolean;
    AreAccessRulesCanonical: boolean;
    AreAuditRulesCanonical: boolean;
}

interface AccessRule {
    FileSystemRights: number;
    AccessControlType: number;
    IdentityReference: {
        Value: string;
    };
    IsInherited: boolean;
    InheritanceFlags: number;
    PropagationFlags: number;
}

interface DirectorySecurityInfo {
    DirectorySecurity: DirectorySecurity;
    AccessRules: AccessRule[];
}

function ShowAcl(unc: string) {
    var $aclTree = $("#acltree");

    var securityRequest = $.ajax("/api/directorysecurity", {
        data: {
            unc: unc,
        },
    });

    securityRequest.done((data: DirectorySecurityInfo) => {

        data.AccessRules.forEach((val) => {
            $.extend(val, {
                id: "",
            });
        });

        $aclTree.jqGrid({
            datatype: "local",
            treedatatype: "local",
            treeGrid: true,
            treeGridModel: "adjacency",

            colNames: [
            'id',
                'FileSystemRights', 'AccessControlType', 'IdentityReference',
                'InheritanceFlags', 'IsInherited', 'PropagationFlags'
            ],
            colModel: [
                { name: 'id' },
                { name: 'FileSystemRights', width: 55},
                { name: 'AccessControlType', width: 90},
                { name: 'IdentityReference', width: 80},
                { name: 'InheritanceFlags', width: 80 },
                { name: 'IsInherited', width: 80},
                { name: 'PropagationFlags', width: 150}],
            rowNum: 10,
            viewrecords: true,
            imgpath: 'themes/basic/images',
        });

        // we have to use addJSONData to load the data
        $aclTree[0].addJSONData({
            total: 1,
            page: 1,
            records: [{
                id: "1",
                parent: ""
            }]
        });


        //data.AccessRules.forEach((rule) => {
        //    var $tr = $("<tr>");
        //    var $td = $("<td>").text(rule.IdentityReference.Value);
        //    $tr.append($td);
        //    $tbody.append($tr);
        //});
    });
    return;
    var $tbody = $aclTree.find("tbody");
    $tbody.empty();

}